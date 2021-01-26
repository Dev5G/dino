export const generateCode = (maxCount, abr, length) => {
	if (length === undefined) {
		length = 5
	}
	const count = abr + (1 + maxCount).toString().padStart(length, '0')
	return count
}