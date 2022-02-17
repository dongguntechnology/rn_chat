import React, {useContext, useState} from 'react';
import styled from 'styled-components/native';
import {Alert} from 'react-native';
import {TButton, PImage, Input} from '../components';
// import {UserContext} from '../contexts';
// import {ProgressContext} from '../contexts';
// import {ThemeContext} from 'styled-components/native';
// import {getCurrentUser, updateUserInfo, signout} from '../firebase';

const Container = styled.View`
   flex: 1;
   background-color: ${({theme}) => theme.background};
   justify-content: center;
   align-items: center;
   padding: 0 20px;
`;

const Profile = ({navigation, route}) => {
   console.log(route.params);
   return (
      <Container>
         <TButton
            title="로그아웃"
            onPress={() => navigation.navigate('Signin')}
         />
      </Container>
   );
};

export default Profile;

/*

const Profile = () => {
  const { spinner } = useContext(ProgressContext);
  const { setUser } = useContext(UserContext);
  const theme = useContext(ThemeContext);
  const user = getCurrentUser();

  const [photo, setPhoto] = useState(user.photo);

  const _handlePhotoChange = async url => {
    try {
      spinner.start();
      const photoURL = await updateUserInfo(url);
      setPhoto(photoURL);
    } catch (e) {
      Alert.alert('Photo Error', e.message);
    } finally {
      spinner.stop();
    }
  };

  return (
    <Container>
      <Image showButton url={photo} onChangePhoto={_handlePhotoChange} />
      <Input label="Name" value={user.name} disabled />
      <Input label="Email" value={user.email} disabled />
      <Button
        title="Sign out"
        onPress={async () => {
          try {
            spinner.start();
            await signout();
          } catch (e) {
          } finally {
            setUser({});
            spinner.stop();
          }
        }}
        containerStyle={{
          backgroundColor: theme.btnSignout,
        }}
      />
    </Container>
  );
};

*/
