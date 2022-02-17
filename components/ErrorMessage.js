import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';

const StyledText = styled.Text`
   align-items: flex-start;
   width: 100%;
   height: 20px;
   margin-bottom: 10px;
   line-height: 20px;
   color: ${({theme}) => theme.errorText};
`;

const ErrorMessage = ({message}) => {
   return <StyledText>{message}</StyledText>;
};

ErrorMessage.propTypes = {
   message: PropTypes.string.isRequired,
};

export default ErrorMessage;

/*
const StyledText = styled.Text`
   align-items: flex-start;
   width: 100%;
   height: 20px;
   margin-bottom: 10px;
   line-height: 20px;
   color: ${({theme}) => theme.errorText};
`;

const ErrorMsg = ({message}) => {
   return <StyledText>{message}</StyledText>;
};

ErrorMsg.propTypes = {
   message: PropTypes.string.isRequired,
};

*/
