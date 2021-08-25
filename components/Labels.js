import { Textfit } from 'react-textfit';
import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';

export default function Labels() {
	const [kids, setKids] = useState([])
	// const [loading, setLoading] = useState(true);

	// Side Effects / Lifecycle
	useEffect(() => {
		const existingKids = localStorage.getItem('kids');
		setKids(existingKids ? JSON.parse(existingKids) : []);
		// setLoading(false);
		// window.print();
		// window.onafterprint = () => history.back();
	}, []);

	return (
		<>
			<button className="btn print-btn" onClick={() => window.print()}>Print</button>
			{kids.map(kid => {
				return (
					<div key={uuidv4()} className="letter-wrap">
						<h2>{kid.firstName}</h2>
						<div className="locker-card">
							<img src={kid.photo} alt="" />
							<div className="name">
								<Textfit mode="single">
									{kid.firstName} <br />
									{kid.lastName}
								</Textfit>
							</div>
						</div>
						<div className="popsicle">
							<p>{kid.firstName}</p>
						</div>
						<div className="center-labels_wrap">
							<div className="center-label">
								<img src={kid.photo} alt="" />
								<div className="fname">
									<Textfit mode="single">
										{kid.firstName}
									</Textfit>
								</div>
							</div>
							<div className="center-label">
								<img src={kid.photo} alt="" />
								<div className="fname">
									<Textfit mode="single">
										{kid.firstName}
									</Textfit>
								</div>
							</div>
							<div className="center-label">
								<img src={kid.photo} alt="" />
								<div className="fname">
									<Textfit mode="single">
										{kid.firstName}
									</Textfit>
								</div>
							</div>
						</div>
					</div>
				)
			})}
		</>
	)
}