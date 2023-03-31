// import { spfi } from '@pnp/sp';
// import * as React from 'react';
// import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
// import {
//   decrement,
//   increment,
//   incrementByAmount,
//   incrementAsync,
//   incrementIfOdd,
//   solicitudes,
// } from '../counterSlice';
// import styles from './VistaGeneral.module.scss';

// function Counter(): React.ReactElement {

// 	const count = useAppSelector(solicitudes);

// 	const dispatch = useAppDispatch();

// 	const [incrementAmount, setIncrementAmount] = React.useState('2');

// 	const incrementValue = Number(incrementAmount) || 0;

// 	return (
// 		<div>
// 		<div className={styles.row}>
// 			<button
// 			className={styles.button}
// 			aria-label="Decrement value"
// 			onClick={() => dispatch(decrement())}
// 			>
// 			-
// 			</button>
// 			<span className={styles.value}>{count}</span>
// 			<button
// 			className={styles.button}
// 			aria-label="Increment value"
// 			onClick={() => dispatch(increment())}
// 			>
// 			+
// 			</button>
// 		</div>
// 		<div className={styles.row}>
// 			<input
// 			className={styles.textbox}
// 			aria-label="Set increment amount"
// 			value={incrementAmount}
// 			onChange={(e) => setIncrementAmount(e.target.value)}
// 			/>
// 			<button
// 			className={styles.button}
// 			onClick={() => dispatch(incrementByAmount(incrementValue))}
// 			>
// 			Add Amount
// 			</button>
// 			<button
// 			className={styles.asyncButton}
// 			onClick={() => dispatch(incrementAsync(incrementValue))}
// 			>
// 			Add Async
// 			</button>
// 			<button
// 			className={styles.button}
// 			onClick={() => dispatch(incrementIfOdd(incrementValue))}
// 			>
// 			Add If Odd
// 			</button>
// 		</div>
// 		</div>
// 	);
// }

// export default Counter;