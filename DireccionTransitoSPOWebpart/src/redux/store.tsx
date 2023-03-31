import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'
import { logger } from 'redux-logger';
import Licencias from './slices/LicenciaSlice' 
import Calendario from '../webparts/calendario/CalendarioSliceReducer' 
import DataInicial from './slices/DataInicialSlice';


export const store = configureStore({ 

    reducer: {

        Licencias: Licencias,

        Calendario: Calendario,

        DataInicial: DataInicial

    },

    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend().concat(logger)

})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;