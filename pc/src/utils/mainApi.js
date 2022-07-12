import { nanoid } from 'nanoid'

export const getUId = () => {
	return new Date().getTime() + parseInt(Math.random()*100000)
}


export const getUUId = () => {
	return nanoid()
}