import React , {useState}from 'react'
import { Alert } from "react-bootstrap";

const  AlertMsg = ({show= false, header= '', msg= '', variant= 'success', onClose}) =>{
	
	const [alert, setAlert] = useState({show,variant, header, msg});
	const setAlertMsg = (variant, header, msg) => {
		let al = { ...alert }
		al.msg = msg
		al.header = header
		al.variant = variant
		al.show = true
		setAlert(al)
    }
	return (
		<>
		{alert.show && (
			<div className="mt-5">
				<Alert variant={alert.variant} onClose={() => onClose()} dismissible>
					<Alert.Heading>{alert.header}</Alert.Heading>
					<p>
						{alert.msg}
					</p>
				</Alert>
			</div>
		)}
		</>
	)
}

export default AlertMsg