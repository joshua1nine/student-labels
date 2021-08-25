import { useEffect } from 'react'
import Labels from '../components/Labels'

export default function printLabels() {
	useEffect(() => {
		window.print();
		window.onafterprint = () => history.back();
	}, []);
	return (
		<Labels />
	)
}
