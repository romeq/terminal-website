import { useEffect, useState } from "react"
import styles from "../styles/Home.module.css"
import { commandHistory as preloadHistory } from "../components/utils/commandHistoryUtil"
import type { InferGetServerSidePropsType, GetServerSideProps } from "next"

export const getServerSideProps: GetServerSideProps<{
    commandHistory: {}
}> = async () => {
    const commandHistory = await preloadHistory()
    return {
        props: { commandHistory },
    }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function TypingAnimation({
    text,
    setDone,
    interval,
    yeet,
}: {
    yeet?: boolean
    text: string
    setDone: () => void
    interval: () => number
}) {
    const [currentText, setCurrentText] = useState(yeet ? text : "")

    useEffect(() => {
        let i = currentText.length
        async function sync() {
            const char = text.charAt(i)
            setCurrentText((prev) => prev + char)
            i++
            await sleep(interval())
        }

        ;(async () => {
            while (i < text.length) await sync()
            await sleep(Math.random() * 200)
            setDone()
        })()
    }, [])

    return <>{currentText}</>
}

function Command({ text, output, whenDone }: { text: string; output: string; whenDone: () => void }) {
    const [done, setDone] = useState(false)

    return (
        <div className={styles.command}>
            <p className={styles.terminalinput}>
                <TypingAnimation text={text} setDone={() => setDone(true)} interval={() => Math.random() * 100} />
            </p>
            <p className={styles.output}>
                {done ? <TypingAnimation text={output} setDone={whenDone} interval={() => 500} yeet={true} /> : <></>}
            </p>
        </div>
    )
}

export default function Home(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [shownCommands, setShownCommands] = useState(1)
    const addShownCmd = () => setShownCommands((prev) => prev + 1)

    return (
        <div className={styles.main}>
            {Object.keys(props.commandHistory)
                .slice(0, shownCommands)
                .map((key) => (
                    <Command text={key} whenDone={addShownCmd} output={props.commandHistory[key]} />
                ))}
        </div>
    )
}
