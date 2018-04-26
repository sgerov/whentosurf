import React from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

class SpotsContainer extends React.Component {
  render() {
    if (this.props.spotsContainerQuery.loading) {
      console.log("loading spots")
    }

    if(this.props.spotsContainerQuery.allSpots) {
      this.props.spotsContainerQuery.allSpots.map(spot => (
        console.log(spot)
      ))
    }

    return(null)
  }
}

const SEARCH_SPOTS_QUERY = gql`
  query {
    allSpots(filter: {
      OR: [
        { name_contains: "indo" }
        { location: { name_contains: "indo"}}
        { location: { country: { name_contains: "indo"}}}
      ]
    }) {
      name
      bottom
      bestMonths
      location {
        name
        country {
          name
        }
      }
    }
  }
`

const SpotsContainerQuery = graphql(SEARCH_SPOTS_QUERY, {
    name: 'spotsContainerQuery',
    options: {
          fetchPolicy: 'network-only',
        },
})(SpotsContainer)

export default SpotsContainerQuery
