import * as React from 'react';
import * as Modal from 'react-modal';
import { connect } from 'react-redux';
import * as Models from '../store/Models';
import * as Store from '../store';
import ChallengeForm from './ChallengeForm';
import ChallengeReport from './ChallengeReport';

if (Modal.defaultStyles.content) {
    Object.assign(Modal.defaultStyles.content, {
        border: 'none',
        backgroundColor: 'transparent'
    })
}

class Home extends React.Component<Store.ApplicationState & Store.ActionCreators, {}> {
    state = {
        showModal: false
    }

    showModal = () => {
        this.setState({ showModal: true });
    }

    hideModal = () => {
        this.setState({ showModal: false });
    }

    sendChallenge = (data: FormData) => {
        this.props.sendChallenge(data);
        this.showModal();
    }

    viewChallenge = (id: string) => () => {
        this.props.requestChallenge(`/api/Challenges/${id}`, true);
        this.showModal();
    }

    componentWillMount() {
        this.props.requestLastChallenges();
    }

    componentDidMount() {
        Modal.setAppElement('#react-app');
    }

    renderChallenge = (challenge: Models.Challenge) => {
        return (
            <tr key={challenge.id} onClick={this.viewChallenge(challenge.id)}>
                <td>{challenge.challengeType}</td>
                <td>{challenge.fileName}</td>
                <td>{challenge.startTime}</td>
                <td>{challenge.endTime || '-'}</td>
                <td>{challenge.duration !== null ? `${challenge.duration}ms` : '-'}</td>
                <td>{challenge.done ? "DONE" : "EXECUTING"}</td>
            </tr>
        );
    }

    public render() {
        return (
            <div>
                <ChallengeForm onSubmit={this.sendChallenge} />
                <h3>Últimos Arquivos</h3>
                <table className="table table-condensed">
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>FileName</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Duration</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.challenges.map(this.renderChallenge)}
                    </tbody>
                </table>
                <Modal isOpen={this.state.showModal}>
                    <ChallengeReport onClose={this.hideModal} />
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state: Store.ApplicationState) => state;

export default connect(mapStateToProps, Store.actionCreators)(Home);
