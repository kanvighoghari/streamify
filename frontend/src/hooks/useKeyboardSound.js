const keyStrokeSound = [
    new Audio("sounds/keystroke1.mp3"),
    new Audio("sounds/keystroke2.mp3"),
    new Audio("sounds/keystroke3.mp3"),
    new Audio("sounds/keystroke4.mp3")
]

function useKeyboardSound() {
    const playRandomKeyStroke = ()=>{
        const randomSound = keyStrokeSound[Math.floor(Math.random()* keyStrokeSound.length)]

        randomSound.currentTime = 0;
        randomSound.play().catch(err => console.log("audio failed to play" , err))
    }

    return {playRandomKeyStroke}
}

export default useKeyboardSound;