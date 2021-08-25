import { useEffect } from 'react'
import Labels from '../components/Labels'

export default function PrintLabels() {
	useEffect(() => {
		window.print();
		window.onafterprint = () => history.back();
	}, []);
	return (
		<Labels />
	)
}
