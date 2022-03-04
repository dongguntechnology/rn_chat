import React, {useState, useRef, useEffect, useContext} from 'react';
import styled from 'styled-components/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Alert} from 'react-native';
import {TButton, Input, ErrorMessage} from '../components';
//import {ProgressContext} from '../contexts';
//import {createChannel} from '../firebase';

const Container = styled.View`
   flex: 1;
   background-color: ${({theme}) => theme.background};
   justify-content: center;
   align-items: center;
   padding: 0 20px;
`;

const ChannelCreation = ({navigation}) => {
   const [title, setTitle] = useState(''); // 채널이름
   const [desc, setDesc] = useState(''); // 채널설명
   const [errorMessage, setErrorMessage] = useState('');
   const [disabled, setDisabled] = useState(true); // 버튼활성화여부
   const refDesc = useRef(null); // 포커스이동

   useEffect(() => {
      setDisabled(!(title && !errorMessage));
   }, [title, errorMessage]);

   const _handleTitleChange = (title) => {
      setTitle(title);
      setErrorMessage(title.trim() ? '' : '채널이름을 입력하세요');
   };

   const _handleDescChange = (desc) => {
      setDesc(desc);
      setErrorMessage(title.trim() ? '' : '채널설명을 입력하세요');
   };

   const _handleCreateBtnPress = async () => {
      // try {
      //    spinner.start();
      //    const id = await createChannel({
      //       title: title.trim(),
      //       desc: desc.trim(),
      //    });
      //    navigation.replace('Channel', {id, title});
      // } catch (e) {
      //    Alert.alert('Creation Error', e.message);
      // } finally {
      //    spinner.stop();
      // }
   };

   return (
      <KeyboardAwareScrollView
         contentContainerStyle={{flex: 1}}
         extraScrollHeight={20}
      >
         <Container>
            <Input
               label="채널이름"
               value={title}
               onChangeText={_handleTitleChange}
               onSubmitEditing={() => refDesc.current.focus()}
            />
            <Input
               ref={refDesc}
               label="채널설명"
               value={desc}
               onChangeText={_handleDescChange}
               onSubmitEditing={_handleCreateBtnPress}
            />
            <ErrorMessage message={errorMessage} />
            <TButton
               title="채널생성"
               disabled={disabled}
               onPress={() => navigation.replace('Channel')}
               onChangeText={_handleDescChange}
            />
         </Container>
      </KeyboardAwareScrollView>
   );
};

export default ChannelCreation;

/*
const StyledText = styled.Text`
   font-size: 30px;
`;

  const { spinner } = useContext(ProgressContext);

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [disabled, setDisabled] = useState(true);

  const refDesc = useRef(null);

  useEffect(() => {
    setDisabled(!(title && !errorMessage));
  }, [title, errorMessage]);

  const _handleTitleChange = title => {
    setTitle(title);
    setErrorMessage(title.trim() ? '' : 'Please enter the title');
  };
  const _handleDescChange = desc => {
    setDesc(desc);
    setErrorMessage(title.trim() ? '' : 'Please enter the title');
  };

  const _handleCreateBtnPress = async () => {
    try {
      spinner.start();
      const id = await createChannel({
        title: title.trim(),
        desc: desc.trim(),
      });
      navigation.replace('Channel', { id, title });
    } catch (e) {
      Alert.alert('Creation Error', e.message);
    } finally {
      spinner.stop();
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{ flex: 1 }}
      extraScrollHeight={20}
    >
      <Container>
        <Input
          label="Title"
          value={title}
          onChangeText={_handleTitleChange}
          onSubmitEditing={() => refDesc.current.focus()}
          onBlur={() => setTitle(title.trim())}
          placeholder="Title"
          returnKeyType="next"
          maxLength={20}
        />
        <Input
          ref={refDesc}
          label="Description"
          value={desc}
          onChangeText={_handleDescChange}
          onSubmitEditing={_handleCreateBtnPress}
          onBlur={() => setDesc(desc.trim())}
          placeholder="Description"
          returnKeyType="done"
          maxLength={40}
        />
        <ErrorMessage message={errorMessage} />
        <Button
          title="Create"
          disabled={disabled}
          onPress={_handleCreateBtnPress}
        />
      </Container>
    </KeyboardAwareScrollView>
  );
*/
