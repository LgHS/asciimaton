import React from "react";

class LineThickness extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      thickness: 1
    };
  }

  handleChange(e) {
    this.setState({
      thickness: parseInt(e.target.value)
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.onClick(this.state.thickness);
  }

  render() {
    return (
        <form>
          <p>
            <label htmlFor="line_thickness_select">
              Line thickness
            </label>
          </p>

          <p>
            <select onChange={this.handleChange.bind(this)} id="line_thickness_select" defaultValue="1">
              <option>1</option>
              <option>2</option>
              <option>3</option>
            </select>

            <button onClick={this.handleSubmit.bind(this)} type="submit">Send</button>
          </p>
        </form>
    );
  }
}

export default LineThickness;