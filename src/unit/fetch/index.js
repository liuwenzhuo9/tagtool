import {insertEntityIndex, deleteEntityBySentenceId, getEntityIndexBySentenceId, deleteEntityByEntityId} from './entityIndex'
import {insertEntity, deleteEntity, findEntityById, findIdByEntity}from './entityOnly'
import {insertSentence, deleteSentence, findSentenceById, findIdBySentence, updateSentenceMarkById, updateSentenceContentById, getAllSentences, getLastSentence, getNextSentence, getFirstUnmarkedSentence}from './sentences'

export {insertEntityIndex, deleteEntityBySentenceId, getEntityIndexBySentenceId, deleteEntityByEntityId, insertEntity, deleteEntity, findEntityById, findIdByEntity,insertSentence, deleteSentence, findSentenceById, findIdBySentence, updateSentenceMarkById, updateSentenceContentById, getAllSentences,getLastSentence, getNextSentence, getFirstUnmarkedSentence}