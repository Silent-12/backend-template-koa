import axios from 'axios';

// 相关文档 https://developer.work.weixin.qq.com/document/path/99110

/**
 * @description 发送消息到企业微信机器人 Webhook。
 * @param {string} content - 要发送的消息内容。
 * @param {string} secret - 企微机器人的 Webhook Secret。
 * @return {Promise<boolean>} 返回发送是否成功。
 */
export async function sendWechatRobotMessage(content: string, secret: string): Promise<boolean> {
  const webhookUrl = `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=${secret}`;

  try {
    const response = await axios.post(webhookUrl, {
      msgtype: 'text',
      text: {
        content
      }
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const result = response.data;

    if (result.errcode === 0) {
      console.log('[企微机器人] 消息发送成功');
      return true;
    } else {
      console.error('[企微机器人] 消息发送失败:', result.errmsg);
      return false;
    }
  } catch (error: any) {
    const errorMessage = error.message || String(error);
    console.error('[企微机器人] 消息发送异常:', errorMessage);
    return false;
  }
}
