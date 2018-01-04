import * as React from 'react';
import { connect } from 'react-redux';
import * as Models from '../store/Models';
import * as Store from '../store';
import ChallengeResults from './ChallengeResults';

interface ChallengeReportProps extends Store.CurrentChallenge, Store.ActionCreators {
    onClose: () => void
}

class ChallengeReport extends React.Component<ChallengeReportProps, {}> {
    renderContent() {
        if (this.props.isLoading) {
            return <p>Loading...</p>;
        } else if (this.props.errorMessage) {
            return <p>{this.props.errorMessage}</p>;
        } else if (this.props.challenge) {
            return (
                <ChallengeResults
                    shouldPoll={!this.props.isView}
                    challenge={this.props.challenge}
                    location={this.props.location || ''}
                    requestChallenge={this.props.requestChallenge}
                />
            );
        } else {
            return null;
        }
    }

    public render() {
        return (
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" onClick={this.props.onClose}>
                            <span>&times;</span>
                        </button>
                        <h4 className="modal-title">Challenge Report</h4>
                    </div>
                    <div className="modal-body">
                        {this.renderContent()}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: Store.ApplicationState) => state.currentChallenge;

export default (connect as any)(mapStateToProps, Store.actionCreators)(ChallengeReport);