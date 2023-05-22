export const Spinner = ({ type }) =>{
	if(type === 'table') {
		return(<tbody className=" text-center inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></tbody>)
	} else {
		return(<div className=" text-center inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>)
	}
}