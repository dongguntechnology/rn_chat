import React, {useState, useEffect, useLayoutEffect} from 'react';
import styled from 'styled-components/native';
import {Alert} from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';
import {
   getFirestore,
   collection,
   onSnapshot,
   query,
   doc,
   setDoc,
   orderBy,
} from 'firebase/firestore';
import {app} from '../firebase';
import {Input} from '../components';

//import {GiftedChat, Send} from 'react-native-gifted-chat';
//import {createMessage, getCurrentUser} from '../firebase';

const db = getFirestore(app);
const Container = styled.View`
   flex: 1;
   background-color: ${({theme}) => theme.background};
`;

const StyledText = styled.Text`
   font-size: 30px;
`;

const createMessage = async ({channelId, message}) => {
   const collection_Ref = collection(db, `channels/${channelId}/messages`);
   await setDoc(doc(collection_Ref, message._id), {
      ...message,
      createdAt: Date.now(),
   });
};

const Channel = ({route}) => {
   const [message, setMessage] = useState([]);
   return (
      <Container>
         <StyledText>채널</StyledText>
         <Input
            value={message}
            onChangeText={setMessage}
            onSubmitEditing={() =>
               createMessage({channelId: route.params.id, message})
            }
         />
      </Container>
   );
};

export default Channel;

/*

const SendIcon = styled(MaterialIcons).attrs(({ theme, text }) => ({
  name: 'send',
  size: 24,
  color: text ? theme.sendBtnActive : theme.sendBtnInactive,
}))``;

const SendButton = props => {
  return (
    <Send
      {...props}
      containerStyle={{
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 4,
      }}
      disabled={!props.text}
    >
      <SendIcon text={props.text} />
    </Send>
  );
};

const Channel = ({ navigation, route }) => {
  const [messages, setMessages] = useState([]);
  const { uid, name, photo } = getCurrentUser();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: route.params.title || 'Channel',
    });
  }, []);

  const db = getFirestore(app);
  useEffect(() => {
    const docRef = doc(db, 'channels', route.params.id);
    const collectionQuery = query(
      collection(db, `${docRef.path}/messages`),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(collectionQuery, snapshot => {
      const list = [];
      snapshot.forEach(doc => {
        list.push(doc.data());
      });
      setMessages(list);
    });
    return () => unsubscribe();
  }, []);

  const _handleMessageSend = async messageList => {
    const message = messageList[0];
    try {
      await createMessage({ channelId: route.params.id, message });
    } catch (e) {
      Alert.alert('Message Error', e.message);
    }
  };

  return (
    <Container>
      <GiftedChat
        placeholder="Enter a message ..."
        messages={messages}
        user={{ _id: uid, name, avatar: photo }}
        onSend={_handleMessageSend}
        renderSend={props => <SendButton {...props} />}
        scrollToBottom={true}
        renderUsernameOnMessage={true}
        alwaysShowSend={true}
        multiline={false}
      />
    </Container>
  );
};
*/
