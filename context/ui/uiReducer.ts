import { UiState } from './';

type UIType =
   | {type: '[UI] -ToggleMenu'}


export const uiReducer = (state: UiState, action: UIType): UiState =>{

    switch (action.type) {
      case '[UI] -ToggleMenu':
       return {
        ...state,
        isMenuOpen: !state.isMenuOpen
           }

       default:
        return state
}

}