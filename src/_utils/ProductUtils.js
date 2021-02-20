export const generateCode = (maxCount, abr, length:int) => {
	length === undefined && (length = 5)
	let count = (1+ parseInt(maxCount,0))
	count = `${abr}${count.toString().padStart(length, '0')}`
	return count
}