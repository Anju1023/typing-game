'use client';

import { useState } from 'react';

const pythonWords = ['def', 'class', 'import', 'return', 'function'];

export default function TypingGame() {
	const [currentWord, setCurrentWord] = useState(pythonWords[0]);
	const [userInput, setUserInput] = useState('');
	const [score, setScore] = useState(0);

	return (
		<div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
			<div className="text-center">
				<h1 className="text-4xl font-bold mb-8">Python Typing Game</h1>
				<div className="text-2xl mb-4">{currentWord}</div>
				<input
					value={userInput}
					onChange={(e) => setUserInput(e.target.value)}
					className="text-black px-4 py-2 text-xl"
					placeholder="Type here..."
				/>
				<div className="mt-4">Score: {score}</div>
			</div>
		</div>
	);
}
