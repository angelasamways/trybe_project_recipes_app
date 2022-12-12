import { useEffect, useState, useContext } from 'react';
import { useParams, NavLink, useHistory } from 'react-router-dom';
import requestRecipesFromAPI from '../services/requestRecipesFromAPI';
import display from '../helpers/display';
import '../style/Details.css';
import RecipesAppContext from '../context/RecipesAppContext';
import InteractionBtns from './InteractionBtns';
import handleFilter from '../helpers/handleFilter';

function DetailsDrinks() {
  const [newFav, setNewFav] = useState({});
  const { inProgressRecipes, setInProgressRecipes } = useContext(RecipesAppContext);
  const history = useHistory();
  const SIX = 6;
  const [recipePhoto, setRecipePhoto] = useState('');
  const [recipeTitle, setRecipeTitle] = useState('');
  const [recipeAlcoholic, setRecipeAlcoholic] = useState('');
  const [instructions, setInstructions] = useState('');
  const [ingredientAndMeasure, setIngredientAndMeasure] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const { idDaReceita } = useParams();

  const displayDetails = async () => {
    const FIFTEEN = 15;
    const request = await requestRecipesFromAPI(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${idDaReceita}`);
    const result = {
      id: request[0].idDrink,
      type: 'drink',
      nationality: '',
      category: request[0].strCategory,
      alcoholicOrNot: request[0].strAlcoholic,
      name: request[0].strDrink,
      image: request[0].strDrinkThumb,
    };
    setNewFav(result);
    const filtro = handleFilter(request, FIFTEEN);
    setIngredientAndMeasure(filtro);
    setRecipePhoto(request[0].strDrinkThumb);
    setRecipeTitle(request[0].strDrink);
    setRecipeAlcoholic(request[0].strAlcoholic);
    setInstructions(request[0].strInstructions);
  };

  const requestRecommendations = async () => {
    const result = await requestRecipesFromAPI('https://www.themealdb.com/api/json/v1/1/search.php?s=');
    setRecommendations(result);
  };

  useEffect(() => {
    displayDetails();
    requestRecommendations();
  }, []);

  const rrp = () => { // redirect to recipe in progress
    setInProgressRecipes({
      ...inProgressRecipes,
      drinks: {
        ...inProgressRecipes.drinks,
        [idDaReceita]: [],
      },
    });
    history.push(`/drinks/${idDaReceita}/in-progress`);
  };

  const toggleInProgress = () => {
    const storage = JSON.parse(localStorage.getItem('inProgressRecipes'))
     || { drinks: {}, meals: {} };
    const recipesID = Object.keys(storage.drinks);
    return recipesID.includes(idDaReceita) ? 'Continue Recipe' : 'Start Recipe';
  };

  return (
    <div>
      <NavLink
        to="/drinks"
      >
        Voltar
      </NavLink>
      <img
        width="250"
        data-testid="recipe-photo"
        src={ recipePhoto }
        alt={ idDaReceita }
      />
      <h3
        data-testid="recipe-title"
      >
        {recipeTitle}
      </h3>
      <h4
        data-testid="recipe-category"
      >
        {recipeAlcoholic}
      </h4>
      <InteractionBtns
        newFav={ newFav }
        idDaReceita={ idDaReceita }
      />
      <ul>
        {ingredientAndMeasure.map((e, i) => (
          <li
            data-testid={ `${i}-ingredient-name-and-measure` }
            key={ i }
          >
            {e}
          </li>
        ))}
      </ul>
      <p
        data-testid="instructions"
      >
        {instructions}

      </p>
      <section
        className="recommendationCard-container"
      >
        {display(SIX, recommendations)
          .map(({ strMeal, strMealThumb, idMeal }, index) => (
            <NavLink
              to={ `/meals/${idMeal}` }
              className="recommendationCard"
              key={ index }
              data-testid={ `${index}-recommendation-card` }
            >
              <p
                data-testid={ `${index}-recommendation-title` }
              >
                {strMeal}
              </p>
              <img src={ strMealThumb } alt={ strMeal } />
            </NavLink>
          ))}
      </section>
      <button
        className="start-recipe-btn"
        data-testid="start-recipe-btn"
        type="button"
        onClick={ rrp } // redirect to recipe in progress
      >
        { toggleInProgress() }
      </button>
    </div>
  );
}

export default DetailsDrinks;
