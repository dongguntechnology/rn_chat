import React, {useContext, useState, useRef, useEffect} from 'react';
import {ThemeContext} from 'styled-components/native';
import styled from 'styled-components/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Alert} from 'react-native';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth';
import {app} from '../firebase';
import {TButton, PImage, Input, ErrorMessage} from '../components';
import {validateEmail, removeWhitespace} from '../utils';
// import { UserContext, ProgressContext } from '../contexts';

// auth 생성
const auth = getAuth(app);

const Container = styled.View`
   flex: 1;
   justify-content: center;
   align-items: center;
   background-color: ${({theme}) => theme.background};
   padding: 0 20px;
   padding-top: ${({insets: {top}}) => top}px;
   padding-bottom: ${({insets: {bottom}}) => bottom}px;
`;

const LOGO =
   'https://firebasestorage.googleapis.com/v0/b/rn-chat-aba36.appspot.com/o/logo.png?alt=media';

const Signin = ({navigation}) => {
   const insets = useSafeAreaInsets();
   const theme = useContext(ThemeContext);

   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [errorMessage, setErrorMessage] = useState('');
   const [disabled, setDisabled] = useState(true);
   const refPassword = useRef(null);

   // TButton 의 활성화 여부를 결정하는 disabled 상태변수의 값을 변경
   useEffect(() => {
      setDisabled(!(email && password && !errorMessage));
      console.log(disabled);
   }, [email, password, errorMessage]);

   // 입력된 이메일주소내 공백제거
   const _handleEmailChange = (email) => {
      const changedEmail = removeWhitespace(email);
      setEmail(changedEmail);
      setErrorMessage(
         validateEmail(changedEmail) ? '' : '이메일형식에 맞게 입력하세요'
      );
   };

   // 입력된 암호내 공백제거
   const _handlePasswordChange = (password) => {
      setPassword(removeWhitespace(password));
   };

   const _handleSigninBtnPress = async () => {
      try {
         // spinner.start();
         const {user} = await signInWithEmailAndPassword(auth, email, password);
         console.log('333333 ', user);
         navigation.navigate('Profile', {user});
         // setUser(user);
      } catch (e) {
         Alert.alert('Signin Error', e.message);
      } finally {
         spinner.stop();
      }
      console.log('로그인');
   };

   return (
      <KeyboardAwareScrollView
         extraScrollHeight={20}
         contentContainerStyle={{flex: 1}}
      >
         <Container insets={insets}>
            <PImage url={LOGO} />
            <Input
               label="메일주소"
               placeholder="Email"
               returnKeyType="next"
               value={email}
               onChangeText={_handleEmailChange}
               // 메일입력후에 Input.js 의 암호입력란으로 포커스를 자동으로 옮김
               onSubmitEditing={() => refPassword.current.focus()}
            />
            <ErrorMessage message={errorMessage} />
            <Input
               ref={refPassword}
               label="암호"
               placeholder="Password"
               returnKeyType="done"
               value={password}
               onChangeText={_handlePasswordChange}
               isPassword={true}
               onSubmitEditing={_handleSigninBtnPress}
            />
            <TButton
               title="로그인"
               onPress={_handleSigninBtnPress}
               disabled={disabled}
            />
            <TButton
               title="회원가입"
               onPress={() => navigation.navigate('Signup')}
               containerStyle={{marginTop: 0, backgroundColor: 'transparent'}}
               textStyle={{color: theme.btnTextLink, fontSize: 18}}
            />
         </Container>
      </KeyboardAwareScrollView>
   );
};

export default Signin;

/*
import React, { useContext, useState, useRef, useEffect } from 'react';
import { ThemeContext } from 'styled-components/native';
import styled from 'styled-components/native';
import { Button, Image, Input, ErrorMessage } from '../components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { signin } from '../firebase';
import { Alert } from 'react-native';
import { validateEmail, removeWhitespace } from '../utils';
import { UserContext, ProgressContext } from '../contexts';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.background};
  padding: 0 20px;
  padding-top: ${({ insets: { top } }) => top}px;
  padding-bottom: ${({ insets: { bottom } }) => bottom}px;
`;

const LOGO =
  'https://firebasestorage.googleapis.com/v0/b/rn-chat-aba36.appspot.com/o/logo.png?alt=media';

const Signin = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const theme = useContext(ThemeContext);
  const { setUser } = useContext(UserContext);
  const { spinner } = useContext(ProgressContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [disabled, setDisabled] = useState(true);
  const refPassword = useRef(null);

  useEffect(() => {
    setDisabled(!(email && password && !errorMessage));
  }, [email, password, errorMessage]);

  const _handleEmailChange = email => {
    const changedEmail = removeWhitespace(email);
    setEmail(changedEmail);
    setErrorMessage(
      validateEmail(changedEmail) ? '' : 'Please verify your email'
    );
  };
  const _handlePasswordChange = password => {
    setPassword(removeWhitespace(password));
  };

  const _handleSigninBtnPress = async () => {
    try {
      spinner.start();
      const user = await signin({ email, password });
      setUser(user);
    } catch (e) {
      Alert.alert('Signin Error', e.message);
    } finally {
      spinner.stop();
    }
  };

  return (
    <KeyboardAwareScrollView
      extraScrollHeight={20}
      contentContainerStyle={{ flex: 1 }}
    >
      <Container insets={insets}>
        <Image url={LOGO} />
        <Input
          label="Email"
          placeholder="Email"
          returnKeyType="next"
          value={email}
          onChangeText={_handleEmailChange}
          onSubmitEditing={() => refPassword.current.focus()}
        />
        <Input
          ref={refPassword}
          label="Password"
          placeholder="Password"
          returnKeyType="done"
          value={password}
          onChangeText={_handlePasswordChange}
          isPassword={true}
          onSubmitEditing={_handleSigninBtnPress}
        />
        <ErrorMessage message={errorMessage} />
        <Button
          title="Sign in"
          onPress={_handleSigninBtnPress}
          disabled={disabled}
        />
        <Button
          title="or sign up"
          onPress={() => navigation.navigate('Signup')}
          containerStyle={{ marginTop: 0, backgroundColor: 'transparent' }}
          textStyle={{ color: theme.btnTextLink, fontSize: 18 }}
        />
      </Container>
    </KeyboardAwareScrollView>
  );
};
*/
