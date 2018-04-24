import React, { Component } from "react";
import "./App.css";
import styled from "styled-components";

const Main = styled.h1`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  flex-wrap: wrap;
  font-size: 50px;
  padding: 4%;
  background: rgb(58, 56, 151);
  background: linear-gradient(
    45deg,
    rgba(58, 56, 151, 1) 0%,
    rgba(163, 161, 255, 1) 100%
  );
`;

const Input = styled.input`
  font-size: 50px;
  background: transparent;
  outline: none;
  border: 1px solid #eee;
  border-width: 0 0 1px;
  color: #eee;
  width: 250px;
  margin-left: 20px;

  &::placeholder {
    color: inherit;
    opacity: 0.25;
  }
`;

const MadeBy = styled.p`
  position: absolute;
  bottom: 20px;
  right: 20px;
  font-size: 14px;
`;

const Question = styled.p``;

const Results = styled.div``;

const Spot = styled.div`
  font-size: 30px;
`;

const SpotName = styled.div`
  position: relative;
  font-weight: bold;
  text-transform: uppercase;
  font-size: 40px;
  margin-bottom: 30px;

  &:after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 0;
    width: 50px;
    height: 2px;
    background: #eee;
  }
`;

const SpotHighlight = styled.div`
  margin-top: 10px;
`;

const fakeData = {
  name: "Macaroni",
  location: {
    name: "Mentawai",
    country: {
      name: "Indonesia"
    }
  },
  bottom: "REEFCORAL",
  id: "cjge5g5ti000m0161rxofhbv8",
  bestMonths: ["JANUARY", "MARCH", "APRIL"]
};

class App extends Component {
  state = {
    countries: [],
    locations: [],
    spots: []
  };

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ spots: [fakeData] });
  };

  render() {
    const { spots, locations, countries } = this.state;
    const haveResults = spots.length || locations.length || countries.length;

    return (
      <div>
        {haveResults ? (
          <Main>
            <Results>
              {spots.map(
                ({
                  id,
                  name,
                  location: {
                    name: locationName,
                    country: { name: countryName }
                  },
                  bottom,
                  bestMonths
                }) => (
                  <Spot key={id}>
                    <SpotName>{name}</SpotName>
                    <SpotHighlight>
                      <span aria-label="Location" role="img">🏖</span> {" "}
                      <a
                        href={`https://www.google.es/maps/place/${locationName},${countryName}`}
                        target="_blank"
                      >
                        {locationName} ({countryName})
                      </a>
                    </SpotHighlight>
                    <SpotHighlight><span aria-label="Bottom" role="img">⬇️</span> {bottom}</SpotHighlight>
                    <SpotHighlight>
                      <span aria-label="Best" role="img">
                        🤙🏽
                      </span> {bestMonths.map(m => m.toLowerCase()).join(", ")}
                    </SpotHighlight>
                  </Spot>
                )
              )}
            </Results>
          </Main>
        ) : (
          <Main>
            <Question>
              When to{" "}
              <span aria-label="Surf" role="img">
                🏄🏽‍
              </span>{" "}
              in
            </Question>
            <form onSubmit={this.handleSubmit}>
              <Input type="text" placeholder="Bali" />
            </form>
          </Main>
        )}
        <MadeBy>Made with ❤️ by ...</MadeBy>
      </div>
    );
  }
}

export default App;
