import React from 'react'

const Observation = ({observation}) => {
    return(
<li>{observation.name}, {observation.rarity} , {observation.timestamp}</li>
    )
}

export default Observation