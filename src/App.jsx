import { useState, useEffect } from 'react';
import './App.css';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, addDoc, collection, getDoc, deleteDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, setPersistence, browserLocalPersistence, onAuthStateChanged, signInWithRedirect } from 'firebase/auth';

function App() {
	const firebaseConfig = {
		apiKey: 'AIzaSyDNKt6AI7actx05i4zZ8_DGqj8kn_jC4uQ',
		authDomain: 'chore-frontend.firebaseapp.com',
		projectId: 'chore-frontend',
		storageBucket: 'chore-frontend.appspot.com',
		messagingSenderId: '20753851547',
		appId: '1:20753851547:web:22d54455468d727a6bd23e'
	};

	// Initialize Firebase
	const app = initializeApp(firebaseConfig);
	const auth = getAuth(app);
	setPersistence(auth, browserLocalPersistence);
	// set persistance

	const provider = new GoogleAuthProvider();

	const db = getFirestore(app);

	function CreateUsernamePass() {
		createUserWithEmailAndPassword(auth, 'mmblessbrian@gmail.com', 'P@ssword412930293!')
			.then((userCredential) => {
				// Signed in
				const user = userCredential.user;
				console.log(user);
				// ...
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.log(errorCode, errorMessage);
				// ..
			});
	}

	async function CreateNewChore() {
		// Add a new document in collection "cities"
		try {
			const docRef = await addDoc(collection(db, 'chores'), {
				name: 'test chore',
				author_uuid: auth.currentUser.uid,
				description: 'test chore',
				completed: false
			});
			console.log('Document written with ID: ', docRef.id);
		} catch (e) {
			console.error('Error adding document: ', e);
		}
	}

	onAuthStateChanged(auth, (user) => {
		if (user) {
			// User is signed in, see docs for a list of available properties
			// https://firebase.google.com/docs/reference/js/firebase.User
			const uid = user.uid;
			console.log(`user is signed in with ${uid}`);
			// ...
		} else {
			// User is signed out
			// ...
			console.log('user signed out');
		}
	});

	async function GetChoresByCompletionStatus(status) {
		const q = query(collection(db, 'chores'), where('completed', '==', status));

		const querySnapshot = await getDocs(q);
		querySnapshot.forEach((doc) => {
			const customDoc = doc.data();
			customDoc.id = doc.id;
			// doc.data() is never undefined for query doc snapshots
			console.log(customDoc);
		});
	}

	function LoginWithGoogle(e) {
		e.preventDefault();

		signInWithPopup(auth, provider)
			.then((result) => {
				// This gives you a Google Access Token. You can use it to access the Google API.
				const credential = GoogleAuthProvider.credentialFromResult(result);
				const token = credential.accessToken;
				// The signed-in user info.
				const user = result.user;
				console.log(user);
				// ...
			})
			.catch((error) => {
				// Handle Errors here.
				const errorCode = error.code;
				const errorMessage = error.message;
				// The email of the user's account used.
				const email = error.customData.email;
				// The AuthCredential type that was used.
				const credential = GoogleAuthProvider.credentialFromError(error);
				// ...
			});
	}

	function LogoutHandler() {
		auth.signOut()
			.then(() => {
				console.log('signed out');
			})
			.catch(() => {
				console.log('sign out error; please contact Admin');
			});
	}

	async function ReadChoreById(id) {
		const docRef = doc(db, 'chores', id);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			console.log('Document data:', docSnap.data());
		} else {
			// doc.data() will be undefined in this case
			console.log('No such document!');
		}
	}

	async function MakeNewChore() {
		await CreateNewChore()
			.catch((e) => {
				console.log('failed to make new chore with error', e);
			})
			.finally(() => console.log('finished processing creating new chore'));
	}

	return (
		<div className='App'>
			<h1>chore tracker</h1>
			<h3>brian</h3>
			<ul>
				<div>
					<h5>clean cat box</h5>
					<p>Due: Today</p>
					<button onClick={MakeNewChore}>click to make new chore</button>
				</div>
				<button onClick={LoginWithGoogle}>sign in with google</button>
				<button onClick={ReadChoreById}>get chore</button>
				<button onClick={() => GetChoresByCompletionStatus(false)}>get non completed chores</button>
			</ul>
			<h3>bianca</h3>
		</div>
	);
}

export default App;

