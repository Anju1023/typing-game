'use client';

import { useState } from 'react';

const pythonWords = [
	'def',
	'class',
	'import',
	'return',
	'function',
	'print',
	'len',
	'range',
];

export default function TypingGame() {
	const [currentWordIndex, setCurrentWordIndex] = useState(0);
	const [userInput, setUserInput] = useState('');
	const [score, setScore] = useState(0);

	const currentWord = pythonWords[currentWordIndex];

	const handleSubmit = () => {
		if (userInput.trim() === currentWord) {
			// 正解！
			setScore(score + 1);

			// 次の単語へ
			setTimeout(() => {
				setCurrentWordIndex((currentWordIndex + 1) % pythonWords.length);
				setUserInput('');
			}, 300);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && userInput.trim() === currentWord) {
			handleSubmit();
		}
	};

	const renderWord = () => {
		return currentWord.split('').map((char, index) => {
			let bgColor = 'bg-gray-700';

			if (index < userInput.length) {
				if (userInput[index] === char) {
					bgColor = 'bg-green-500';
				} else {
					bgColor = 'bg-red-500';
				}
			} else if (index === userInput.length) {
				bgColor = 'bg-blue-500';
			}

			return (
				<span
					key={index}
					className={`${bgColor} text-white px-1 py-2 m-1 rounded-2xl font-mono text-4xl transition-colors duration-200`}
				>
					{char}
				</span>
			);
		});
	};

	return (
		<div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
			<div className="text-center">
				<h1 className="text-4xl font-bold mb-8 text-blue-400">
					🐍 Python Typing Game
				</h1>

				<div className="mb-8 flex justify-center items-center">
					{renderWord()}
				</div>

				<input
					value={userInput}
					onChange={(e) => setUserInput(e.target.value)}
					onKeyDown={handleKeyDown}
					className="text-black px-4 py-2 text-xl rounded border-2 border-gray-300"
					placeholder="Type here and press Enter..."
					autoFocus
				/>

				<div className="mt-6 text-2xl">
					🎯 Score: <span className="text-yellow-400 font-bold">{score}</span>
				</div>

				<div className="mt-4 text-sm text-gray-400">
					💡 Green = Correct, Red = Wrong, Blue = Current position
				</div>
			</div>
		</div>
	);
}
