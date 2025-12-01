import mqtt from 'mqtt';
import { normalizeWeatherState, QWEATHER_ICON_MAP } from '../components/weatherUtils';

class MqttService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.onWeatherUpdate = null;
    this.onDemoModeUpdate = null;
    this.onConnectionChange = null;
  }

  connect(config) {
    if (this.client) {
      this.client.end();
    }

    const { mqtt_host, mqtt_port, mqtt_username, mqtt_password } = config;
    if (!mqtt_host) return;

    const url = `ws://${mqtt_host}:${mqtt_port || 1884}/`;

    this.client = mqtt.connect(url, {
      username: mqtt_username || undefined,
      password: mqtt_password || undefined,
      reconnectPeriod: 5000,
    });

    this.client.on('connect', () => {
      this.connected = true;
      this.onConnectionChange?.(true);
      this.subscribeTopics();
      this.registerEntities();
    });

    this.client.on('close', () => {
      this.connected = false;
      this.onConnectionChange?.(false);
    });

    this.client.on('error', (err) => {
      console.error('MQTT error:', err);
      this.connected = false;
      this.onConnectionChange?.(false);
    });

    this.client.on('message', (topic, message) => {
      this.handleMessage(topic, message.toString());
    });
  }

  subscribeTopics() {
    if (!this.client) return;
    this.client.subscribe('smartscreen/demo_mode/set');
    this.client.subscribe('smartscreen/demo_state/set');
    this.client.subscribe('smartscreen/demo_festival/set');
    this.client.subscribe('smartscreen/weather_entity/set');
    this.client.subscribe('smartscreen/weather/state'); // 订阅天气状态更新
  }

  registerEntities() {
    if (!this.client) return;

    // 演示模式开关
    this.publish('homeassistant/switch/smartscreen_demo_mode/config', JSON.stringify({
      name: 'SmartScreen 演示模式',
      unique_id: 'smartscreen_demo_mode',
      command_topic: 'smartscreen/demo_mode/set',
      state_topic: 'smartscreen/demo_mode/state',
      payload_on: 'ON',
      payload_off: 'OFF',
      device: this.getDeviceInfo(),
    }));

    // 天气状态选择
    this.publish('homeassistant/select/smartscreen_demo_state/config', JSON.stringify({
      name: 'SmartScreen 天气状态',
      unique_id: 'smartscreen_demo_state',
      command_topic: 'smartscreen/demo_state/set',
      state_topic: 'smartscreen/demo_state/state',
      options: ['CLEAR_DAY', 'CLEAR_NIGHT', 'PARTLY_CLOUDY_DAY', 'CLOUDY', 'LIGHT_RAIN', 'MODERATE_RAIN', 'HEAVY_RAIN', 'STORM_RAIN', 'LIGHT_SNOW', 'MODERATE_SNOW', 'HEAVY_SNOW', 'THUNDER_SHOWER', 'HAIL', 'WIND', 'FOG'],
      device: this.getDeviceInfo(),
    }));

    // 节日选择
    this.publish('homeassistant/select/smartscreen_demo_festival/config', JSON.stringify({
      name: 'SmartScreen 节日效果',
      unique_id: 'smartscreen_demo_festival',
      command_topic: 'smartscreen/demo_festival/set',
      state_topic: 'smartscreen/demo_festival/state',
      options: ['无', '春节', '元宵节', '清明', '端午节', '中秋节', '国庆节', '圣诞节', '平安夜', '情人节', '除夕', '元旦', '万圣节', '七夕'],
      device: this.getDeviceInfo(),
    }));

    // 天气实体选择（输入框）
    this.publish('homeassistant/text/smartscreen_weather_entity/config', JSON.stringify({
      name: 'SmartScreen 天气实体',
      unique_id: 'smartscreen_weather_entity',
      command_topic: 'smartscreen/weather_entity/set',
      state_topic: 'smartscreen/weather_entity/state',
      device: this.getDeviceInfo(),
    }));
  }

  getDeviceInfo() {
    return {
      identifiers: ['smartscreen_weather'],
      name: 'SmartScreen 天气屏',
      manufacturer: 'SmartScreen',
      model: 'Weather Display',
      sw_version: '1.0.0',
    };
  }

  handleMessage(topic, message) {
    if (topic === 'smartscreen/demo_mode/set') {
      const enabled = message === 'ON';
      this.onDemoModeUpdate?.({ demo_mode: enabled });
      this.publish('smartscreen/demo_mode/state', message);
    } else if (topic === 'smartscreen/demo_state/set') {
      this.onDemoModeUpdate?.({ demo_state: message });
      this.publish('smartscreen/demo_state/state', message);
    } else if (topic === 'smartscreen/demo_festival/set') {
      const festival = message === '无' ? '' : message;
      this.onDemoModeUpdate?.({ demo_festival: festival });
      this.publish('smartscreen/demo_festival/state', message);
    } else if (topic === 'smartscreen/weather_entity/set') {
      this.onWeatherUpdate?.({ weather_entity: message });
      this.publish('smartscreen/weather_entity/state', message);
    } else if (topic === 'smartscreen/weather/state') {
      // 接收 HA 发来的天气数据
      try {
        const data = JSON.parse(message);
        const attrs = data.attributes || {};
        let weatherState, mappedKey, weatherText;

        if (attrs.skycon) {
          // 彩云天气
          weatherState = attrs.skycon;
          mappedKey = normalizeWeatherState(weatherState);
        } else if (attrs.condition_cn && attrs.qweather_icon) {
          // 和风天气
          weatherState = attrs.condition_cn;
          mappedKey = QWEATHER_ICON_MAP[String(attrs.qweather_icon)] || normalizeWeatherState(data.state);
          weatherText = attrs.condition_cn;
        } else {
          // 默认
          weatherState = data.state;
          mappedKey = normalizeWeatherState(weatherState);
        }

        this.onWeatherDataUpdate?.({
          state: weatherState,
          mappedKey,
          temperature: attrs.temperature ?? data.temperature,
          attributes: attrs,
          friendly_name: data.friendly_name || '',
          weatherText
        });
      } catch (e) {
        console.error('Failed to parse weather data:', e);
      }
    }
  }

  publishState(state) {
    if (!this.client || !this.connected) return;

    if (state.demo_mode !== undefined) {
      this.publish('smartscreen/demo_mode/state', state.demo_mode ? 'ON' : 'OFF');
    }
    if (state.demo_state) {
      this.publish('smartscreen/demo_state/state', state.demo_state);
    }
    if (state.demo_festival !== undefined) {
      this.publish('smartscreen/demo_festival/state', state.demo_festival || '无');
    }
    if (state.weather_entity) {
      this.publish('smartscreen/weather_entity/state', state.weather_entity);
    }
  }

  publish(topic, message) {
    if (this.client && this.connected) {
      this.client.publish(topic, message, { retain: true });
    }
  }

  disconnect() {
    if (this.client) {
      this.client.end();
      this.client = null;
      this.connected = false;
    }
  }
}

export const mqttService = new MqttService();
