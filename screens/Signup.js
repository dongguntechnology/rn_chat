import React, {useState, useRef, useEffect, useContext} from 'react';
import styled from 'styled-components/native';
import {TButton, PImage, Input, ErrorMessage} from '../components';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Alert} from 'react-native';
import {
   getAuth,
   createUserWithEmailAndPassword,
   signOut,
   updateProfile,
} from 'firebase/auth';
import {getDownloadURL, getStorage, ref, uploadBytes} from 'firebase/storage';
import app from '../firebase';
import {validateEmail, removeWhitespace} from '../utils';
import {UserContext, ProgressContext} from '../contexts';
// import { signin } from '../firebase';

const auth = getAuth(app);

const uploadImage = async (uri) => {
   // console.log(uri, '==========');
   // 전달된 파일주소가 https 로 시작하면 업로드취소
   if (uri.startsWith('https')) {
      return uri;
   }
   const response = await fetch(uri);
   const blob = await response.blob();
   const {uid} = auth.currentUser;
   console.log('555', uid);
   const storage = getStorage(app);

   // Profile 폴더내에 uid 값과 일치하는 고유한 하위폴더가 생성되고 그내부에 photo.png 가 생성됨
   const storageRef = ref(storage, `/Profile/${uid}/photo.png`);
   await uploadBytes(storageRef, blob, {
      contentType: 'image/png',
   });

   return await getDownloadURL(storageRef);
};

// 디비에 회원정보등록
const DB_signup = async ({name, email, password, photo}) => {
   const {user} = await createUserWithEmailAndPassword(auth, email, password);
   //console.log(user, photo);
   const photoURL = await uploadImage(photo);
   await updateProfile(auth.currentUser, {displayName: name, photoURL});
   return user;
};

const Container = styled.View`
   flex: 1;
   justify-content: center;
   align-items: center;
   background-color: ${({theme}) => theme.background};
   padding: 50px 20px;
`;

const DEFAULT_PHOTO =
   'https://firebasestorage.googleapis.com/v0/b/rn-chat-aba36.appspot.com/o/face.png?alt=media';

const Signup = ({navigation}) => {
   const {setUser} = useContext(UserContext);
   const {spinner} = useContext(ProgressContext);

   const [photo, setPhoto] = useState(DEFAULT_PHOTO);
   // DEFAULT_PHOTO = PImage.defaultProps
   const [name, setName] = useState('');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [passwordConfirm, setPasswordConfirm] = useState('');
   const [errorMessage, setErrorMessage] = useState('');
   const [disabled, setDisabled] = useState(true);

   const refEmail = useRef(null);
   const refPassword = useRef(null);
   const refPasswordConfirm = useRef(null);
   const refDidMount = useRef(null); // 초기실행시 error 변수가 화면에 바로  출력되는 것을 방지함

   // TButton 의 활성화 여부를 결정하는 disabled 상태변수의 값을 변경
   useEffect(() => {
      setDisabled(
         !(name && email && password && passwordConfirm && !errorMessage)
      );
      //console.log(disabled);
   }, [name, email, password, passwordConfirm, errorMessage]);

   useEffect(() => {
      if (refDidMount.current) {
         let error = '';
         if (!name) {
            error = '이름을 입력하세요';
         } else if (!email) {
            error = '메일주소를 입력하세요';
         } else if (!validateEmail(email)) {
            error = '메일형식이 맞지 않군요';
         } else if (password.length < 6) {
            error = '암호는 6자이상이어야 합니다';
         } else if (password !== passwordConfirm) {
            error = '입력하신 두개의 암호가 서로 다릅니다';
         } else {
            error = '';
         }
         setErrorMessage(error);
      } else {
         refDidMount.current = true;
      }
   }, [email, name, password, passwordConfirm]);

   const _handleSignupBtnPress = async () => {
      try {
         spinner.start();
         const user = await DB_signup({name, email, password, photo});
         navigation.navigate('Profile', {user});
         setUser(user); // 회원가입 성공 후 setUser 기능으로 사용자정보를 업데이트함
      } catch (e) {
         Alert.alert('Signup Error', e.message);
      } finally {
         spinner.stop();
      }
   };

   return (
      <KeyboardAwareScrollView extraScrollHeight={30}>
         <Container>
            <PImage showButton={true} url={photo} onChangePhoto={setPhoto} />
            <Input
               label="이름"
               placeholder="Name"
               returnKeyType="next"
               value={name}
               onChangeText={setName}
               // 메일입력후에 Input.js 의 암호입력란으로 포커스를 자동으로 옮김
               onSubmitEditing={() => refEmail.current.focus()}
               // 입력된 이름의 앞뒤의 공백을 제거함
               onBlur={() => setName(name.trim())}
               maxLength={12}
            />
            <Input
               ref={refEmail}
               label="메일주소"
               placeholder="Email"
               returnKeyType="next"
               value={email}
               onChangeText={setEmail}
               // 메일입력후에 Input.js 의 암호입력란으로 포커스를 자동으로 옮김
               onSubmitEditing={() => refPassword.current.focus()}
               // 입력된 메일주소내의 공백을 제거
               onBlur={() => setEmail(removeWhitespace(email))}
            />
            <Input
               ref={refPassword}
               label="암호"
               placeholder="Password"
               returnKeyType="done"
               value={password}
               onChangeText={setPassword}
               isPassword={true}
               onSubmitEditing={() => refPasswordConfirm.current.focus()}
               onBlur={() => setPassword(removeWhitespace(password))}
            />
            <Input
               ref={refPasswordConfirm}
               label="암호확인"
               placeholder="PasswordConfirm"
               returnKeyType="done"
               value={passwordConfirm}
               onChangeText={setPasswordConfirm}
               isPassword={true}
               onSubmitEditing={_handleSignupBtnPress}
               onBlur={() =>
                  setPasswordConfirm(removeWhitespace(passwordConfirm))
               }
            />
            <ErrorMessage message={errorMessage} />
            <TButton
               title="가입하기"
               onPress={_handleSignupBtnPress}
               disabled={disabled}
            />
         </Container>
      </KeyboardAwareScrollView>
   );
};

export default Signup;

/*

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.background};
  padding: 50px 20px;
`;

const DEFAULT_PHOTO =
  'https://firebasestorage.googleapis.com/v0/b/rn-chat-aba36.appspot.com/o/face.png?alt=media';

const Signup = ({ navigation }) => {
  const { setUser } = useContext(UserContext);
  const { spinner } = useContext(ProgressContext);

  const [photo, setPhoto] = useState(DEFAULT_PHOTO);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [disabled, setDisabled] = useState(true);

  const refEmail = useRef(null);
  const refPassword = useRef(null);
  const refPasswordConfirm = useRef(null);
  const refDidMount = useRef(null);

  useEffect(() => {
    setDisabled(
      !(name && email && password && passwordConfirm && !errorMessage)
    );
  }, [email, name, passwordConfirm, password, errorMessage]);

  useEffect(() => {
    if (refDidMount.current) {
      let error = '';
      if (!name) {
        error = 'Please enter your name';
      } else if (!email) {
        error = 'Please enter your email';
      } else if (!validateEmail(email)) {
        error = 'Please verify your email';
      } else if (password.length < 6) {
        error = 'The password must contain 6 characters at least';
      } else if (password !== passwordConfirm) {
        error = 'Password need to match';
      } else {
        error = '';
      }
      setErrorMessage(error);
    } else {
      refDidMount.current = true;
    }
  }, [email, name, passwordConfirm, password]);

  const _handleSignupBtnPress = async () => {
    try {
      spinner.start();
      const user = await signup({ name, email, password, photo });
      setUser(user);
    } catch (e) {
      Alert.alert('Signup Error', e.message);
    } finally {
      spinner.stop();
    }
  };

  return (
    <KeyboardAwareScrollView extraScrollHeight={20}>
      <Container>
        <Image showButton={true} url={photo} onChangePhoto={setPhoto} />
        <Input
          label="Name"
          placeholder="Name"
          returnKeyType="next"
          value={name}
          onChangeText={setName}
          onSubmitEditing={() => refEmail.current.focus()}
          onBlur={() => setName(name.trim())}
          maxLength={12}
        />
        <Input
          ref={refEmail}
          label="Email"
          placeholder="Email"
          returnKeyType="next"
          value={email}
          onChangeText={setEmail}
          onSubmitEditing={() => refPassword.current.focus()}
          onBlur={() => setEmail(removeWhitespace(email))}
        />
        <Input
          ref={refPassword}
          label="Password"
          placeholder="Password"
          returnKeyType="next"
          value={password}
          onChangeText={setPassword}
          isPassword={true}
          onSubmitEditing={() => refPasswordConfirm.current.focus()}
          onBlur={() => setPassword(removeWhitespace(password))}
        />
        <Input
          ref={refPasswordConfirm}
          label="Password Confirm"
          placeholder="Password"
          returnKeyType="done"
          value={passwordConfirm}
          onChangeText={setPasswordConfirm}
          isPassword={true}
          onSubmitEditing={_handleSignupBtnPress}
          onBlur={() => setPasswordConfirm(removeWhitespace(passwordConfirm))}
        />
        <ErrorMessage message={errorMessage} />
        <Button
          title="Sign up"
          onPress={_handleSignupBtnPress}
          disabled={disabled}
        />
      </Container>
    </KeyboardAwareScrollView>
  );
};
*/
