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
	const [mistakes, setMistakes] = useState(0);
	const [showMistakeEffect, setShowMistakeEffect] = useState(false); // エフェクト表示用
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

	// フォーカス設定とIME制御
	useEffect(() => {
		if (inputRef.current && isGameActive) {
			inputRef.current.focus();

			// より強力なIME制御
			const input = inputRef.current;
			if (input) {
				// @ts-ignore - TypeScriptエラー回避
				input.style.imeMode = 'disabled';
				input.setAttribute('inputmode', 'latin');
			}
		}
	}, [isGameActive]);

	const startGame = () => {
		setIsGameActive(true);
		setIsGameOver(false);
		setScore(0);
		setMistakes(0);
		setShowMistakeEffect(false);
		setTimeLeft(30);
		setCurrentWordIndex(Math.floor(Math.random() * pythonWords.length));
		setUserInput('');
	};

	const resetGame = () => {
		setIsGameActive(false);
		setIsGameOver(false);
		setScore(0);
		setMistakes(0);
		setShowMistakeEffect(false);
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

		// IME関連のキーイベントをブロック
		if (e.key === 'Process' || e.key === 'Unidentified') {
			e.preventDefault();
		}
	};

	// IME入力を完全に防ぐ
	const handleComposition = (e: React.CompositionEvent) => {
		e.preventDefault();
		return false;
	};

	const showMistake = () => {
		setShowMistakeEffect(true);
		setTimeout(() => {
			setShowMistakeEffect(false);
		}, 500); // 0.5秒で消える
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;

		if (!isGameActive) return;

		// 最後の文字だけチェック（追加された文字）
		if (value.length > userInput.length) {
			const newChar = value[value.length - 1];
			const expectedChar = currentWord[userInput.length];

			// 英数字とアンダースコアとドット以外は除去
			if (!/[a-zA-Z0-9._]/.test(newChar)) {
				return; // 何もしない
			}

			if (newChar === expectedChar) {
				// 正解！
				setUserInput(userInput + newChar);
			} else {
				// ミス！
				setMistakes((prev) => prev + 1);
				showMistake();
				// 入力は追加しない
			}
		} else if (value.length < userInput.length) {
			// バックスペースの場合は許可
			setUserInput(value);
		}
	};

	const renderWord = () => {
		return currentWord.split('').map((char, index) => {
			let bgColor = 'bg-gray-700';

			if (index < userInput.length) {
				// 入力済み（必ず正解）
				bgColor = 'bg-green-500';
			} else if (index === userInput.length) {
				// 現在の入力位置
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

	// ミス表示エフェクト（条件付きで表示）
	const MistakeEffect = () => {
		if (!showMistakeEffect) return null;

		return (
			<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
				<div className="text-red-500 text-6xl font-bold animate-ping">✗</div>
			</div>
		);
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
						<p>💡 自動で英数字入力になるよ〜</p>
						<p>🚫 間違った文字は赤いバツマークが出るよ！</p>
						<p>✅ 正しい文字を入力するまで先に進めないよ〜</p>
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
		const totalAttempts = score + mistakes;
		const accuracy =
			totalAttempts > 0 ? Math.round((score / totalAttempts) * 100) : 0;

		return (
			<div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-6xl font-bold mb-8 text-yellow-400">
						🎉 結果発表！
					</h1>
					<div className="text-8xl font-bold mb-4 text-green-400">{score}</div>
					<p className="text-2xl mb-4 text-gray-300">問正解！</p>
					<div className="text-lg text-gray-400 mb-8 space-y-2">
						<p>
							❌ ミス:{' '}
							<span className="text-red-400 font-bold">{mistakes}</span>回
						</p>
						<p>
							🎯 正確率:{' '}
							<span className="text-blue-400 font-bold">{accuracy}%</span>
						</p>
					</div>
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
		<div className="min-h-screen bg-gray-900 text-white flex items-center justify-center relative">
			<MistakeEffect />

			<div className="text-center">
				<div className="flex justify-between items-center mb-8 w-full max-w-lg mx-auto">
					<div className="text-xl">
						🎯 Score: <span className="text-yellow-400 font-bold">{score}</span>
					</div>
					<div className="text-xl">
						❌ Miss: <span className="text-red-400 font-bold">{mistakes}</span>
					</div>
					<div
						className={`text-2xl font-bold ${
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
					autoComplete="off"
					autoCorrect="off"
					autoCapitalize="off"
					spellCheck="false"
					inputMode="text"
				/>

				<div className="mt-4 text-sm text-gray-400">
					💡 間違えた時だけ✗マークが出るよ〜
				</div>
			</div>
		</div>
	);
}
