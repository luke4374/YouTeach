import React, { Component } from 'react';
import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RtcEngine, {
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
} from 'react-native-agora';
import TopNav from "../../components/TopNav/index";

import requestCameraAndAudioPermission from '../../components/Permission';
import styles from '../../components/Style';

export default class AgoraLive extends Component {
    _engine?:RtcEngine;

    state = {
        appId: "f690c9244f954a25b02f72550f7d5375",
        token: "0938308055c148db88fa97fddeb3d94c",
        channelName: 'channel-x',
        joinSucceed: false,
        peerIds: [],
      };

      componentDidMount() {
          this.init();
      }

    /**
     * @name init
     * @description Function to initialize the Rtc Engine, attach event listeners and actions
     */
    init = async () => {
        const { appId } = this.state;
        this._engine = await RtcEngine.create(appId);
        await this._engine.enableVideo();

        this._engine.addListener('Warning', (warn) => {
        console.log('Warning', warn);
        });

        this._engine.addListener('Error', (err) => {
        console.log('Error', err);
        });

        this._engine.addListener('UserJoined', (uid, elapsed) => {
        console.log('UserJoined', uid, elapsed);
        // Get current peer IDs
        const { peerIds } = this.state;
        // If new user
        if (peerIds.indexOf(uid) === -1) {
            this.setState({
            // Add peer ID to state array
            peerIds: [...peerIds, uid],
            });
        }
        });

        this._engine.addListener('UserOffline', (uid, reason) => {
        console.log('UserOffline', uid, reason);
        const { peerIds } = this.state;
        this.setState({
            // Remove peer ID from state array
            peerIds: peerIds.filter((id) => id !== uid),
        });
        });

        // If Local user joins RTC channel
        this._engine.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
        console.log('JoinChannelSuccess', channel, uid, elapsed);
        // Set state variable to true
        this.setState({
            joinSucceed: true,
        });
        });
    };


  /**
   * @name startCall
   * @description Function to start the call
   */
   startCall = async () => {
    // Join Channel using null token and channel name
    await this._engine?.joinChannel(
      this.state.token,
      this.state.channelName,
      null,
      0
    );
  };

  /**
   * @name endCall
   * @description Function to end the call
   */
  endCall = async () => {
    await this._engine?.leaveChannel();
    this.setState({ peerIds: [], joinSucceed: false });
  };

  render() {
    return (
      <View style={styles.max}>
        <View style={styles.max}>
          <View style={styles.buttonHolder}>
            <TouchableOpacity onPress={this.startCall} style={styles.button}>
              <Text style={styles.buttonText}> Start Call </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.endCall} style={styles.button}>
              <Text style={styles.buttonText}> End Call </Text>
            </TouchableOpacity>
          </View>
          {this._renderVideos()}
        </View>
      </View>
    );
  }

  _renderVideos = () => {
    const { joinSucceed } = this.state;
    return joinSucceed ? (
      <View style={styles.fullView}>
        <RtcLocalView.SurfaceView
          style={styles.max}
          channelId={this.state.channelName}
          renderMode={VideoRenderMode.Hidden}
        />
        {this._renderRemoteVideos()}
      </View>
    ) : null;
  };

  _renderRemoteVideos = () => {
    const { peerIds } = this.state;
    return (
      <ScrollView
        style={styles.remoteContainer}
        contentContainerStyle={{ paddingHorizontal: 2.5 }}
        horizontal={true}
      >
        {peerIds.map((value) => {
          return (
            <RtcRemoteView.SurfaceView
              style={styles.remote}
              uid={value}
              channelId={this.state.channelName}
              renderMode={VideoRenderMode.Hidden}
              zOrderMediaOverlay={true}
            />
          );
        })}
      </ScrollView>
    );
  };
}
