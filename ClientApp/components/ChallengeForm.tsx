import * as React from 'react';

interface ChallengeFormProps {
    onSubmit: (data: FormData) => void
}

export default class ChallengeForm extends React.Component<ChallengeFormProps, {}> {
    refs: {
        type: HTMLSelectElement,
        file: HTMLInputElement,
        form: HTMLFormElement
    }

    sendChallenge = () => {
        const data = new FormData();
        const type = this.refs.type.value;
        const files = this.refs.file.files;
        if (files && files.length > 0) {
            data.append("type", type);
            data.append("file", files[0]);

            this.refs.form.reset();
            this.props.onSubmit(data);
        }
    }

    preventSubmit = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    public render() {
        return (
            <form ref="form" className="row challenge-form" onSubmit={this.preventSubmit}>
                <div className="col-md-3 col-md-offset-2">
                    <select ref="type" className="form-control">
                        <option value="canguru">Canguru</option>
                        <option value="minmaxsoma">Min Max Soma</option>
                        <option value="quaseordenado">Quase Ordenado</option>
                    </select>
                </div>
                <div className="col-md-4">
                    <input ref="file" type="file" className="form-control" />
                </div>
                <div className="col-md-3">
                    <button className="btn btn-primary" onClick={this.sendChallenge}>Enviar</button>
                </div>
            </form>
        );
    }
}