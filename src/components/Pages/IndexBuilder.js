import React, {useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";

import styled from "styled-components";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import {DataPanel, Legend, MapSection, VariablePanel} from "../index";

import IndicatorsList from "../IndexBuilder/Indicators";
import IndicatorDetails from "../IndexBuilder/IndicatorDetails";
import IndexBuilderFooter from "../IndexBuilder/IndexBuilderFooter";
import {WeightsSliders, WeightsPieChart} from "../IndexBuilder/Weights";
import {IndicatorsHelperText, WeightsHelperText} from "../IndexBuilder/HelperText";

import {defaultBounds} from "./Map";
import {colors} from "../../config";
import {FaArrowCircleLeft} from "@react-icons/all-files/fa/FaArrowCircleLeft";

import {setPanelState} from "../../actions";
import {FaCaretDown} from "@react-icons/all-files/fa/FaCaretDown";

// TODO: Convert style={{ }} to styled-components

const FloatingPanel = styled.h1`
  font-weight: normal;
  position: fixed;
  margin: 0;
  padding: 0;
  z-index: 1;
  width: 375px;
  border: 1px solid ${colors.green};
  background-color: ${colors.white};
  box-shadow: rgba(43, 43, 43, 0.267) 3px 0px 5px;;
  min-width: 200px;
`;

const BoldedPinkText = styled.strong`
  color: ${colors.pink};
`;
const LinkButton = styled(Button)`
  color: ${colors.forest};
`;
const PrimaryButton = styled(Button)`
  background-color: ${props => `rgba(61, 96, 23, ${props.canNext ? 100 : 30})`};
  color: ${colors.white};
  &:active {
    background-color: ${props => `rgba(61, 96, 23, ${props.canNext ? 100 : 30})`};
  }
  &:hover {
    background-color: ${props => `rgba(61, 96, 23, ${props.canNext ? 100 : 30})`};
  }
`;

// TODO: source these icons from @react-icons/all-files
const FaCsvIcon = () =>
    <svg style={{ width: '1rem', marginRight: '1rem' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        { /* !Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc. */}
        <path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V304H176c-35.3 0-64 28.7-64 64V512H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zM200 352h16c22.1 0 40 17.9 40 40v8c0 8.8-7.2 16-16 16s-16-7.2-16-16v-8c0-4.4-3.6-8-8-8H200c-4.4 0-8 3.6-8 8v80c0 4.4 3.6 8 8 8h16c4.4 0 8-3.6 8-8v-8c0-8.8 7.2-16 16-16s16 7.2 16 16v8c0 22.1-17.9 40-40 40H200c-22.1 0-40-17.9-40-40V392c0-22.1 17.9-40 40-40zm133.1 0H368c8.8 0 16 7.2 16 16s-7.2 16-16 16H333.1c-7.2 0-13.1 5.9-13.1 13.1c0 5.2 3 9.9 7.8 12l37.4 16.6c16.3 7.2 26.8 23.4 26.8 41.2c0 24.9-20.2 45.1-45.1 45.1H304c-8.8 0-16-7.2-16-16s7.2-16 16-16h42.9c7.2 0 13.1-5.9 13.1-13.1c0-5.2-3-9.9-7.8-12l-37.4-16.6c-16.3-7.2-26.8-23.4-26.8-41.2c0-24.9 20.2-45.1 45.1-45.1zm98.9 0c8.8 0 16 7.2 16 16v31.6c0 23 5.5 45.6 16 66c10.5-20.3 16-42.9 16-66V368c0-8.8 7.2-16 16-16s16 7.2 16 16v31.6c0 34.7-10.3 68.7-29.6 97.6l-5.1 7.7c-3 4.5-8 7.1-13.3 7.1s-10.3-2.7-13.3-7.1l-5.1-7.7c-19.3-28.9-29.6-62.9-29.6-97.6V368c0-8.8 7.2-16 16-16z"/>
    </svg>

const FaPngIcon = () =>
    <svg style={{ width: '1rem', marginRight: '1rem' }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
        { /* !Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc. */}
        <path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM64 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm152 32c5.3 0 10.2 2.6 13.2 6.9l88 128c3.4 4.9 3.7 11.3 1 16.5s-8.2 8.6-14.2 8.6H216 176 128 80c-5.8 0-11.1-3.1-13.9-8.1s-2.8-11.2 .2-16.1l48-80c2.9-4.8 8.1-7.8 13.7-7.8s10.8 2.9 13.7 7.8l12.8 21.4 48.3-70.2c3-4.3 7.9-6.9 13.2-6.9z"/>
    </svg>

/** Paged wizard-like component to present indicators for selection + allow user to set the weights */
export default function IndexBuilder() {
    const history = useHistory();
    const dispatch = useDispatch();

    /** for example, see components/IndexBuilder/IndicatorsStep */
    const [steps] = useState(['indicators', 'weights', 'summary']);
    const [currentStep, setCurrentStep] = useState(steps[0]);

    // User's last-clicked tooltip icon
    const [selectedDetails, setSelectedDetails] = useState(undefined);

    // User's indicator/variable selections
    // TODO: Default selections?
    const [selections, setSelections] = useState([]);

    const mapParams = useSelector((state) => state.mapParams);

    // Hide margin from DataPanel (hidden)
    dispatch(setPanelState({info: false}));

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const downloadCsv = (event) => {
        console.log('Downloading CSV...');
        handleClose();
    };
    const downloadPng = (event) => {
        console.log('Downloading PNG...');
        handleClose();
    };

    return (
        <>
            { /*<NavBar showMapControls={true} bounds={defaultBounds} />*/ }

            <Grid container spacing={2} style={{ marginTop:'4vh', marginBottom:'10vh', paddingLeft: '15vw', paddingRight: '15vw' }}>
                <Grid item xs={6}>
                    {
                        currentStep === 'indicators' && !selectedDetails && <>
                            <h1 style={{ marginBottom: '2rem', fontWeight: 'normal' }}>
                                <FaArrowCircleLeft onClick={() => history.goBack()} style={{ verticalAlign: 'middle', marginRight: '1rem', color: colors.forest, cursor: 'pointer' }} />
                                1. Select Indicators
                            </h1>
                            <IndicatorsHelperText />
                        </>

                    }
                    {
                        currentStep === 'weights' && !selectedDetails && <>
                            <h1 style={{ marginBottom: '2rem', fontWeight: 'normal' }}>
                                <FaArrowCircleLeft onClick={() => setCurrentStep('indicators')} style={{ verticalAlign: 'middle', marginRight: '1rem', color: colors.forest, cursor: 'pointer' }} />
                                2. Choose Weights
                            </h1>
                            <WeightsHelperText />
                            <WeightsPieChart selections={selections} />
                        </>
                    }
                    {
                        !!selectedDetails && <>
                            <IndicatorDetails selectedDetails={selectedDetails}
                                              setSelectedDetails={setSelectedDetails} />
                            {
                                currentStep === 'weights' && <WeightsPieChart selections={selections}
                                                                              width={500}
                                                                              height={300} />
                            }
                        </>
                    }
                </Grid>
                <Grid item xs style={{ paddingTop: '8vh' }}>
                    {
                        currentStep === 'indicators' && <>
                            <IndicatorsList selections={selections}
                                            setSelections={setSelections}
                                            setCurrentStep={setCurrentStep}
                                            setSelectedDetails={setSelectedDetails} />
                        </>
                    }
                    {
                        currentStep === 'weights' && <>
                            <WeightsSliders selections={selections}
                                            setSelections={setSelections}
                                            setSelectedDetails={setSelectedDetails} />
                        </>
                    }
                </Grid>
            </Grid>

            {
                currentStep === 'summary' && <>
                    <FloatingPanel style={{ top: '25px', left: '20px' }}>
                        <FaArrowCircleLeft onClick={() => setCurrentStep('weights')} style={{ verticalAlign: 'middle', marginRight: '1rem', color: colors.forest, cursor: 'pointer' }} />
                        3. Summary & Map
                    </FloatingPanel>
                    <div id="mainContainer" style={{ position: 'fixed' }}>
                        <MapSection bounds={defaultBounds} showSearch={false} />
                        <Legend
                            variableName={`${mapParams.variableName} ${
                                mapParams.units ? `(${mapParams.units})` : ""
                            }`}
                            colorScale={mapParams.colorScale}
                            bins={mapParams.bins}
                        />
                        <FloatingPanel style={{ top: '75px', left: '20px' }}>
                            <div style={{ padding: '0 2rem', marginTop: '2rem' }}>
                                <Typography variant={'h6'} style={{ marginBottom: '1rem' }}>Custom Index</Typography>
                                <Typography variant={'body2'} style={{ marginBottom: '2rem' }}>
                                    <p>The custom index you created has themes:</p>
                                    <p>
                                        <BoldedPinkText>Ecology & Greenness</BoldedPinkText>,
                                        <BoldedPinkText> Demographic</BoldedPinkText>,
                                        <BoldedPinkText> Health</BoldedPinkText>, and
                                        <BoldedPinkText> Social</BoldedPinkText>.
                                        With an additional focus on social indicators, the custom index
                                        will be useful for house management and family planning policy makers.
                                    </p>

                                </Typography>
                            </div>
                            <div style={{ marginBottom:'2rem', padding: '0 2rem 1rem 2rem' }}>
                                <WeightsPieChart selections={selections}
                                                 showLegend={false}
                                                 cx={150}
                                                 width={350}
                                                 height={150} />
                            </div>

                            <div style={{ padding: '0.5rem', width: '100%', backgroundColor: 'lightgrey', position: 'absolute', bottom: 0, }}>
                                <Grid container spacing={0}>
                                    <Grid item xs>
                                        <LinkButton size={'small'} onClick={() => history.goBack()}>Exit</LinkButton>
                                    </Grid>
                                    <Grid item xs={5}>
                                        <PrimaryButton
                                            id="demo-customized-button"
                                            aria-controls={open ? 'demo-customized-menu' : undefined}
                                            aria-haspopup="true"
                                            aria-expanded={open ? 'true' : undefined}
                                            variant="contained"
                                            disableElevation
                                            onClick={handleClick}
                                            size={'small'}
                                            endIcon={<FaCaretDown style={{ color: colors.green }} />}
                                        >
                                            Download
                                        </PrimaryButton>
                                        <Menu id="demo-customized-menu"
                                              MenuListProps={{
                                                  'aria-labelledby': 'demo-customized-button',
                                              }}
                                              anchorEl={anchorEl}
                                              open={open}
                                              onClose={handleClose}>
                                            <MenuItem disabled={true} onClick={() => downloadCsv()} disableRipple>
                                                 <FaCsvIcon /> CSV
                                            </MenuItem>
                                            <MenuItem disabled={true} onClick={() => downloadPng()} disableRipple>
                                                 <FaPngIcon /> PNG
                                            </MenuItem>
                                        </Menu>
                                    </Grid>
                                </Grid>
                            </div>
                        </FloatingPanel>

                        { /*<VariablePanel />*/ }
                        {/* <DataPanel /> */}
                        {/* <Popover /> */}
                    </div>
                </>
            }
            {
                currentStep !== 'summary' && <IndexBuilderFooter canNext={currentStep !== 'summary' && selections.length > 0}
                                                                 currentStep={currentStep}
                                                                 setCurrentStep={setCurrentStep}
                                                                 setSelections={setSelections}
                                                                 setSelectedDetails={setSelectedDetails} />
            }
        </>
    );
};

