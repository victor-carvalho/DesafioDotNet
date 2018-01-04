import * as React from 'react';
import * as Models from '../store/Models';

interface ChallengeResultsProps {
    location: string;
    shouldPoll: boolean;
    challenge: Models.Challenge;
    requestChallenge: (location: string, isView: boolean) => Promise<any>;
}

export default class ChallengeResults extends React.Component<ChallengeResultsProps, {}> {
    polling = true;

    poll = () => {
        this.props.requestChallenge(this.props.location, false).then(() => {
            if (this.polling)
                setTimeout(this.poll, 500);
        });
    }

    componentDidMount() {
        if (this.props.shouldPoll) {
            this.poll();
        } else {
            this.polling = false;
        }
    }

    componentDidUpdate(prev: ChallengeResultsProps) {
        if (this.props.challenge.done) {
            this.polling = false;
        }
    }

    renderResult = (result: Models.ChallengeResult) => {
        return (
            <tr key={result.id}>
                <td>{result.fileName}</td>
                <td>{result.output}</td>
                <td>{result.isCorrect ? "CORRECT" : "INCORRECT"}</td>
                <td>{result.done ? (result.errorMessage ? 'ERROR' : 'DONE') : 'PENDING'}</td>
            </tr>
        );
    }


    public render() {
        return (
            <table className="table table-condensed table-striped">
                <thead>
                    <tr>
                        <th>Filename</th>
                        <th>Output</th>
                        <th>IsCorrect</th>
                        <th>Done</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.challenge.results.map(this.renderResult)}
                </tbody>
            </table>
        );
    }
}
