import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import ButtonGroup from '@material-ui/core/ButtonGroup'; 

import styled from 'styled-components';

import Tooltip from './tooltip';
import { StyledDropDown, BinsContainer, Gutter } from '../styled_components';
import { changeVariable, setMapParams, setPanelState } from '../actions'; //variableChangeZ, setNotification, storeMobilityData
import { fixedScales, colorScales, colors, variablePresets } from '../config';
import * as SVG from '../config/svg';

const VariablePanelContainer = styled.div`
  position:fixed;
  left:10px;
  top:60px;
  height:auto;
  min-width:200px;
  background-color: ${colors.white};
  box-shadow: 2px 0px 5px ${colors.gray}44;
  padding:0;
  box-sizing: border-box;
  transition:250ms all;
  font: 'Roboto', sans-serif;
  color:${colors.black};
  z-index:50;
  // border-radius:20px;
  &.hidden {
    transform: translateX(-100%);
  }
  h1,h2,h3,h4 {
    font-family: 'Roboto', sans-serif;
    margin: 0 0 10px 0;
  }
  p {
    font-family: 'Lora', serif;
    margin: 10px 0;
  }
  @media (max-width:1024px) {
    min-width:50vw;
  }  
  @media (max-width:600px) {
    width:100%;
    display: ${props => props.otherPanels ? 'none' : 'initial'};
  }
  button#showHideLeft {
    position:absolute;
    left:95%;
    top:20px;
    width:40px;
    height:40px;
    box-sizing:border-box;
    padding:0;
    margin:0;
    background-color: ${colors.white};
    box-shadow: 2px 0px 5px ${colors.gray}88;
    outline:none;
    border:none;
    // border-radius:20px;
    cursor: pointer;
    transition:500ms all;
    svg { 
      width:20px;
      height:20px;
      margin:10px 0 0 0;
      @media (max-width:600px){
        width:20px;
        height:20px;
        margin:5px;
      }
      fill:${colors.gray};
      transform:rotate(0deg);
      transition:500ms all;
      .cls-1 {
        fill:none;
        stroke-width:6px;
        stroke:${colors.gray};
      }
    }
    :after {
      opacity:0;
      font-weight:bold;
      content: 'Variables';
      color:${colors.gray};
      position: relative;
      right:-50px;
      top:-22px;
      transition:500ms all;
      z-index:4;
    }
    @media (max-width:768px){
      top:120px;
    }
    @media (max-width:600px) {
      left:90%;
      width:30px;
      height:30px;
      top:140px;
      :after {
        display:none;
      }
    }
  }
  button#showHideLeft.hidden {
    left:105%;
    svg {
      transform:rotate(90deg);
    }
    :after {
      opacity:1;
    }
  }
  user-select:none;
`

const ControlsContainer = styled.div`
  max-height:60vh;
  overflow-y:scroll;
  padding:20px;

  @media (max-height:899px){
    padding:20px 20px 10vh 20px;
  }
  
  @media (max-width:600px) {
    width:100%;
    padding:0 10px 25vh 10px;
  }
  p.data-description {
    max-width: 40ch;
    line-height:1.3;
  }

  ::-webkit-scrollbar {
    width: 10px;
  }
  
  /* Track */
  ::-webkit-scrollbar-track {
    background: ${colors.white};
  }
   
  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: url('${process.env.PUBLIC_URL}/icons/grip.png'), ${colors.onionGreen};
    background-position: center center;
    background-repeat: no-repeat, no-repeat;
    background-size: 50%, 100%; 
    transition:125ms all;
  }
  
  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: url('${process.env.PUBLIC_URL}/icons/grip.png'), ${colors.chicagoDarkBlue};
    background-position: center center;
    background-repeat: no-repeat, no-repeat;
    background-size: 50%, 100%; 
  }
`

const DataDescriptions = {
  'Tree Crown Density': <p>
    This metric describes the amount of tree cover in a given census tract. Data on the location and size of trees was collected by the Chicago Region Trees Initiative 
    in partnership with the U.S. Forest Service. Using LiDAR technology and multiple geoprocessing steps, polygons representing the surface area covered by a tree’s 
    branches and leaves were created. To generate the Tree Crown Density, we  summed the surface area of all trees in a census tract and then divided the total by the 
    surface area of the census tracts. If a given census tract has a tree crown density of 0.5, this translates as <i>“Trees cover 50% of the total surface area in this 
    census tract.”</i> A higher tree crown density means higher tree coverage.
  </p>,
  'PM2.5 in Summer (2014-18)': <p>
    PM 2.5 refers to atmospheric particulate matter (PM) that has a diameter of less than 2.5 micrometers. We used PM 2.5 estimates from EPA sensors in Cook County and 20 neighboring counties as ground truth. To fill in missing gaps between sensors, we generated a model to take advantage of the multivariate relationship between PM 2.5 and aerosol optical depth (a satellite product). Using multiple air quality predictors (such as vegetation, land use, wind speed, temperature, precipitation, aerosol optical depth, point emissions, areal emissions, and more) we estimated PM 2.5 from 2014-2018 at a 1-km resolution using a three-stage model and neural net, replicating previous work and extending it to the local region.  Model performance for this iteration of the model had an R-squared of 0.572 after the first stage with 10-fold cross validation. As the model improves, it will be updated in the tool. 
    <br/><br/>
    For the site selection tool, we cropped the output to the City of Chicago, and aggregated data to the census-tract level; centroids of 1-km grid were assigned to intersecting tracts. We used the average results from Summer 2014-2018, representing peak PM 2.5 trends that occur on a yearly basis, and prepare it as an individual layer.
  </p>,
  'Surface Temperature': <p>
    Some neighborhoods are warmer than others on average, due to complex built and physical environment features, and this is especially pronounced in the summer months. The Urban Heat Island data displays this effect on a map. NASA routinely monitors surface temperatures across the globe by satellites. We used average summer surface temperature in 2018 to rank census tracts in Chicago by average temperature as a proxy for the urban heat island effect. 
    <br/><br/>
    Tracts with indices closer to 1 are the hottest areas in the city. Tracts with indices closer to 0 are the coldest census tracts in the city. Suppose a given census tract (Tract A) has an urban heat island index value of 0.25. This translates as “25% of Chicago census tracts are colder than Tract A.” Note: This also means “75% of Chicago census tracts are warmer than Tract A”. 
  </p>,
  'Traffic Volume': <p>
    This measure corresponds to logged average annual average daily traffic counts by street segment, by census tract. We use recent Illinois Department of Transportation (IDOT) traffic data available as road segments containing Annual Average Daily Traffic (AADT) counts. We cropped the data to the City of Chicago (9,373 road segments), simplified to point locations, and calculated total AADT within each Census Tract. These numbers were subsequently log transformed to normalize the distribution for more meaningful analysis.
  </p>,
  'Social Vulnerability Index': <p>
    Social Vulnerability Index is a composite variable of seven socio-economic indicators that represent an average “rank” of vulnerability, generated by the CDC using American Community Survey 2018 5-year estimates.. The SVI was generated from multiple variables demonstrating including Percent of the population that is dependent (0-4 & 65+), Percent with a bachelor’s degree (negatively weighted), Percent of the population that is White; Not Hispanic (negatively weighted), Unemployment rate, Percent of the population with a disability, Percent of renters that are cost burdened, and Percent of homeowners that are cost burdened. These indicators at the census tract level were transformed, normalized into z-scores, and equally weighted to produce a single estimate. An SVI z-score (Vul) greater than zero indicates an area is more vulnerable on average than half of the tracts in the study area.  Thus areas with higher scores have more vulnerability.
  </p>,
}

const VariablePanel = (props) => {

  const dispatch = useDispatch();    

  const { mapParams, panelState } = useSelector(state => state); 

  const handleMapOverlay = (event) =>{
    dispatch(
      setMapParams(
        {
          overlay: event.target.value
        }
      )
    )
  }


  const handleOpenClose = () => {
    if (panelState.variables) {
      dispatch(setPanelState({variables:false}))
    } else {
      dispatch(setPanelState({variables:true}))
    }
  }
  
  const handleVariable = (e) => dispatch(changeVariable(variablePresets[e.target.value]))

  return (
    <VariablePanelContainer className={panelState.variables ? '' : 'hidden'} otherPanels={panelState.info} id="variablePanel">
      <ControlsContainer>
        <h2>Map Variables</h2>
        <StyledDropDown id="newVariableSelect">
          <InputLabel htmlFor="newVariableSelect">Variable</InputLabel>
          <Select
            value={mapParams.variableName}
            onChange={handleVariable}
            MenuProps={{id:'variableMenu'}}
            >
            {Object.keys(variablePresets).map(variable => <MenuItem value={variable} key={variable}>{variable}</MenuItem>)}
          </Select>
        </StyledDropDown>
        <Gutter h={20}/>
        
        <h2>Data Description</h2>
        <p className="data-description">{DataDescriptions[mapParams.variableName]}</p>

        <Gutter h={20}/>
        <h2>Boundary Overlay</h2>
        <StyledDropDown>
          <InputLabel htmlFor="overlay-select">Overlay</InputLabel>
          <Select  
            id="overlay-select"
            value={mapParams.overlay}
            onChange={handleMapOverlay}
          >
            <MenuItem value="None" key={'None'}>None</MenuItem> 
            <MenuItem value={'community_areas'} key={'community_areas'}>Community Areas</MenuItem>
            <MenuItem value={'wards'} key={'wards'}>Wards</MenuItem>
            <MenuItem value={'properties'} key={'properties'}>City Owned Properties</MenuItem>
          </Select>
        </StyledDropDown>

      </ControlsContainer>
      <button onClick={handleOpenClose} id="showHideLeft" className={panelState.variables ? 'active' : 'hidden'}>{SVG.settings}</button>
    </VariablePanelContainer>
  );
}

export default VariablePanel;