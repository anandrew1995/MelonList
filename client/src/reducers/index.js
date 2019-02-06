import { combineReducers } from 'redux'

import chart from './chartReducer'
import user from './userReducer'
import exporter from './exporterReducer'

export default combineReducers({
    chart,
    user,
    exporter
})
