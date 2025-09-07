'use client';
import { useState, useEffect, useRef } from 'react';

const pythonWords = [
	// 基本キーワード
	'def',
	'class',
	'import',
	'from',
	'return',
	'if',
	'else',
	'elif',
	'for',
	'while',
	'try',
	'except',
	'finally',
	'with',
	'as',
	'pass',
	'break',
	'continue',
	'lambda',
	'global',
	'nonlocal',
	'yield',
	'async',
	'await',
	'assert',
	'del',
	'raise',

	// 組み込み関数
	'print',
	'input',
	'len',
	'range',
	'list',
	'dict',
	'tuple',
	'set',
	'str',
	'int',
	'float',
	'bool',
	'type',
	'isinstance',
	'hasattr',
	'getattr',
	'setattr',
	'max',
	'min',
	'sum',
	'abs',
	'round',
	'sorted',
	'reversed',
	'enumerate',
	'zip',
	'map',
	'filter',
	'any',
	'all',
	'open',
	'file',
	'next',
	'iter',

	// よく使うメソッド
	'append',
	'extend',
	'insert',
	'remove',
	'pop',
	'index',
	'count',
	'sort',
	'reverse',
	'copy',
	'clear',
	'keys',
	'values',
	'items',
	'get',
	'update',
	'split',
	'join',
	'replace',
	'strip',
	'lower',
	'upper',
	'startswith',
	'endswith',

	// ライブラリ関連
	'numpy',
	'pandas',
	'matplotlib',
	'requests',
	'json',
	'os',
	'sys',
	'datetime',
	'random',
	'math',
	'time',
	'sqlite3',
	'urllib',
	'pickle',
	'csv',
	'logging',

	// よく使う変数名
	'data',
	'result',
	'value',
	'item',
	'index',
	'key',
	'filename',
	'path',
	'response',
	'content',
	'message',
	'error',
	'config',
	'params',
	'args',
	'kwargs',
];

export default function TypingGame() {
	const [currentWordIndex, setCurrentWordIndex] = useState(0);
	const [userInput, setUserInput] = useState('');
	const [score, setScore] = useState(0);
	const [timeLeft, setTimeLeft] = useState(30);
	const [isGameActive, setIsGameActive] = useState(false);
	const [isGameOver, setIsGameOver] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const currentWord = pythonWords[currentWordIndex];

	useEffect(() => {
		if (isGameActive && timeLeft > 0) {
			const timer = setTimeout(() => {
				setTimeLeft(timeLeft - 1);
			}, 1000);
			return () => clearTimeout(timer);
		} else if (timeLeft === 0) {
			setIsGameActive(false);
			setIsGameOver(true);
		}
	}, [isGameActive, timeLeft]);

	// IMEを無効化して英数字モードにする！
	useEffect(() => {
		if (inputRef.current && isGameActive) {
			inputRef.current.focus();
			// IME無効化（CSSのime-modeは非推奨かつ型エラーになるため、inputに属性を直接設定）
			inputRef.current.setAttribute('inputmode', 'latin');
		}
	}, [isGameActive]);

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.setAttribute('autocomplete', 'off');
			inputRef.current.setAttribute('autocorrect', 'off');
			inputRef.current.setAttribute('autocapitalize', 'off');
			inputRef.current.setAttribute('spellcheck', 'false');
		}
	}, []);

	const startGame = () => {
		setIsGameActive(true);
		setIsGameOver(false);
		setScore(0);
		setTimeLeft(30);
		setCurrentWordIndex(Math.floor(Math.random() * pythonWords.length));
		setUserInput('');
	};

	const resetGame = () => {
		setIsGameActive(false);
		setIsGameOver(false);
		setScore(0);
		setTimeLeft(30);
		setCurrentWordIndex(0);
		setUserInput('');
	};

	const handleSubmit = () => {
		if (userInput === currentWord && isGameActive) {
			setScore(score + 1);
			setTimeout(() => {
				setCurrentWordIndex(Math.floor(Math.random() * pythonWords.length));
				setUserInput('');
			}, 100);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && userInput === currentWord && isGameActive) {
			handleSubmit();
		}

		// ミス入力を防ぐ！！
		if (isGameActive) {
			const nextChar = currentWord[userInput.length];

			// バックスペースは許可
			if (e.key === 'Backspace') {
				return;
			}

			// Enterは完全一致時のみ許可
			if (e.key === 'Enter') {
				if (userInput !== currentWord) {
					e.preventDefault();
				}
				return;
			}

			// 次に入力すべき文字以外は拒否！
			if (e.key !== nextChar && userInput.length < currentWord.length) {
				e.preventDefault();
			}

			// 単語の長さを超える入力は拒否
			if (userInput.length >= currentWord.length) {
				e.preventDefault();
			}
		}
	};

	// IME入力を防ぐ
	const handleComposition = (e: React.CompositionEvent) => {
		e.preventDefault();
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;

		// 正しい文字のみ許可（前の文字まで正しい場合のみ）
		let validInput = '';
		for (let i = 0; i < Math.min(value.length, currentWord.length); i++) {
			if (value[i] === currentWord[i]) {
				validInput += value[i];
			} else {
				break;
			}
		}

		setUserInput(validInput);
	};

	const renderWord = () => {
		return currentWord.split('').map((char, index) => {
			let bgColor = 'bg-gray-700';

			if (index < userInput.length) {
				bgColor = 'bg-green-500'; // 常に正解（間違いは入力されないので）
			} else if (index === userInput.length) {
				bgColor = 'bg-blue-500';
			}

			return (
				<span
					key={index}
					className={`${bgColor} text-white px-1 py-2 m-1 rounded font-mono text-4xl transition-colors duration-200`}
				>
					{char}
				</span>
			);
		});
	};

	if (!isGameActive && !isGameOver) {
		return (
			<div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-6xl font-bold mb-8 text-blue-400">
						🐍 Python Typing
					</h1>
					<p className="text-xl mb-4 text-gray-300">30秒で何問解けるかな？</p>
					<div className="mb-8 text-yellow-300 space-y-2">
						<p>💡 自動で英数字入力モードになるよ〜</p>
						<p>🚫 間違った文字は入力されないよ〜</p>
					</div>
					<div className="mb-8 text-gray-400">
						<p>全{pythonWords.length}種類の単語からランダム出題！</p>
					</div>
					<button
						onClick={startGame}
						className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-lg text-2xl transition-colors"
					>
						🚀 スタート！
					</button>
				</div>
			</div>
		);
	}

	if (isGameOver) {
		return (
			<div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-6xl font-bold mb-8 text-yellow-400">
						🎉 結果発表！
					</h1>
					<div className="text-8xl font-bold mb-4 text-green-400">{score}</div>
					<p className="text-2xl mb-8 text-gray-300">問正解！</p>
					<div className="space-x-4">
						<button
							onClick={startGame}
							className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-xl transition-colors"
						>
							🔄 もう一度！
						</button>
						<button
							onClick={resetGame}
							className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg text-xl transition-colors"
						>
							📋 メニューに戻る
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
			<div className="text-center">
				<div className="flex justify-between items-center mb-8 w-full max-w-md mx-auto">
					<div className="text-2xl">
						🎯 Score: <span className="text-yellow-400 font-bold">{score}</span>
					</div>
					<div
						className={`text-3xl font-bold ${
							timeLeft <= 10 ? 'text-red-400 animate-pulse' : 'text-blue-400'
						}`}
					>
						⏰ {timeLeft}s
					</div>
				</div>

				<div className="mb-8 flex justify-center items-center">
					{renderWord()}
				</div>

				<input
					ref={inputRef}
					value={userInput}
					onChange={handleInputChange}
					onKeyDown={handleKeyDown}
					onCompositionStart={handleComposition}
					onCompositionUpdate={handleComposition}
					onCompositionEnd={handleComposition}
					className="text-black px-4 py-2 text-xl rounded border-2 border-gray-300 font-mono"
					placeholder="Type here..."
					autoFocus
					disabled={!isGameActive}
					style={{ imeMode: 'disabled' }}
				/>

				<div className="mt-4 text-sm text-gray-400">
					💡 正しい文字のみ入力できるよ〜
				</div>
			</div>
		</div>
	);
}
