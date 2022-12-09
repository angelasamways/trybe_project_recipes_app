import { useState, useEffect, useContext } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import RecipesAppContext from '../context/RecipesAppContext';
import requestRecipesFromAPI from '../services/requestRecipesFromAPI';
import handleFilter from '../helpers/handleFilter';
import InteractionBtns from './InteractionBtns';
import '../style/RecipeInProgress.css';

function RecipeDrinksInProgress() {
  const [isChecked, setIsChecked] = useState([]);
  const [newFav, setNewFav] = useState({});
  const [recipePhoto, setRecipePhoto] = useState('');
  const [recipeTitle, setRecipeTitle] = useState('');
  const [recipeAlcoholic, setRecipeAlcoholic] = useState('');
  const [instructions, setInstructions] = useState('');
  const [ingredientAndMeasure, setIngredientAndMeasure] = useState([]);
  const { inProgressRecipes } = useContext(RecipesAppContext);
  const { idDaReceita } = useParams();

  console.log(isChecked);

  const requestDetails = async () => {
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

  useEffect(() => {
    localStorage.setItem('inProgressRecipes', JSON.stringify(inProgressRecipes));
    requestDetails();
  }, []);

  const itsChecked = (ingrediente) => {
    if (isChecked.includes(ingrediente)) {
      return 'ingredient-step';
    }
    return '';
  };

  return (
    <div>
      <NavLink
        to={ `/drinks/${idDaReceita}` }
      >
        Voltar
      </NavLink>
      <img
        width="250"
        data-testid="recipe-photo"
        src={ recipePhoto }
        alt={ idDaReceita }
      />
      <h1
        data-testid="recipe-title"
      >
        {recipeTitle}
      </h1>
      <h4
        data-testid="recipe-category"
      >
        {recipeAlcoholic}
      </h4>
      <InteractionBtns
        idDaReceita={ idDaReceita }
        newFav={ newFav }
      />
      <p
        data-testid="instructions"
      >
        {instructions}
      </p>
      {ingredientAndMeasure.map((e, index) => (
        <label
          data-testid={ `${index}-ingredient-step` }
          htmlFor="ingredient-step"
          className={ itsChecked(e) }
          key={ index }
        >
          <input
            id="ingredient-step"
            type="checkbox"
            value={ e }
            onChange={ ({ target }) => {
              if (isChecked.some((ingredient) => ingredient === target.value)) {
                const newChecked = isChecked.filter((el) => el !== target.value);
                setIsChecked(newChecked);
              } else {
                setIsChecked([...isChecked, target.value]);
              }
            } }
            checked={ isChecked.includes(e) }
          />
          {e}
        </label>
      ))}
      <button
        data-testid="finish-recipe-btn"
        type="button"
      >
        Finalizar
      </button>
    </div>
  );
}

export default RecipeDrinksInProgress;
