import type { Message, TemplateMessage } from '@line/bot-sdk'

export const PURPOSE_CONFIG: TemplateMessage = {
  type: 'template',
  altText: 'This is a buttons template',
  template: {
    type: 'buttons',
    thumbnailImageUrl: 'https://example.com/bot/images/image.jpg',
    imageAspectRatio: 'rectangle',
    imageSize: 'cover',
    imageBackgroundColor: '#FFE4B8',
    title: 'Menu',
    text: 'Please select',
    // defaultAction: {
    //   type: '',
    //   label: "View detail",
    //   uri: "http://example.com/page/123",
    // },
    actions: [
      {
        type: 'postback',
        label: '練習',
        data: 'purpose:練習',
      },
      {
        type: 'postback',
        label: '作品相關：錄音、混音、拍 MV',
        data: 'purpose:作品相關：錄音、混音、拍 MV',
      },
      {
        type: 'postback',
        label: '教學',
        data: 'purpose:教學',
      },
    ],
  },
}

export const IMAGE_CAROUSEL_CONFIG: TemplateMessage = {
  type: 'template',
  altText: 'this is a image carousel template',
  template: {
    type: 'image_carousel',
    columns: [
      {
        imageUrl: 'https://i.imgur.com/XYa0p9u.png',
        action: {
          type: 'datetimepicker',
          label: '選開始時間',
          data: 'start',
          mode: 'datetime',
        },
      },
      {
        imageUrl: 'https://i.imgur.com/oSCurWe.png',
        action: {
          type: 'datetimepicker',
          label: '選結束時間',
          data: 'end',
          mode: 'datetime',
        },
      },
      {
        imageUrl: 'https://example.com/bot/images/item3.jpg',
        // @ts-expect-error good
        title: '你的目的是？',
        action: {
          type: 'postback',
          label: '你的目的是？',
          data: 'purpose',
        },
      },
      {
        imageUrl: 'https://example.com/bot/images/item3.jpg',
        action: {
          type: 'postback',
          label: '提交',
          data: 'confirm',
        },
      },
    ],
  },
}

export const CAROUSEL_CONFIG: TemplateMessage = {
  type: 'template',
  altText: 'this is a carousel template',
  template: {
    type: 'carousel',
    columns: [
      {
        thumbnailImageUrl: 'https://i.imgur.com/XYa0p9u.png',
        imageBackgroundColor: '#FDC25D',
        title: '選擇時間',
        text: '使用冷氣的時間',
        actions: [
          {
            type: 'datetimepicker',
            label: '開始時間',
            data: 'start',
            mode: 'datetime',
          },
          {
            type: 'datetimepicker',
            label: '結束時間',
            data: 'end',
            mode: 'datetime',
          },
          {
            type: 'postback',
            label: '總使用時長',
            data: 'totalTime',
          },
        ],
      },
      {
        thumbnailImageUrl: 'https://i.imgur.com/oSCurWe.png',
        imageBackgroundColor: '#FDC25D',
        title: '使用目的',
        text: '你使用錄音室來做什麼',
        actions: [
          {
            type: 'postback',
            label: '練習',
            data: 'purpose:練習',
          },
          {
            type: 'postback',
            label: '錄音、混音、拍 MV',
            data: 'purpose:錄音、混音、拍 MV',
          },
          {
            type: 'postback',
            label: '教學',
            data: 'purpose:教學',
          },
        ],
      },
      {
        thumbnailImageUrl:
          'https://stickershop.line-scdn.net/stickershop/v1/product/8763/LINEStorePC/main.png;compress=true',
        imageBackgroundColor: '#FDC25D',
        title: '提交',
        text: '確定要提交嗎',
        actions: [
          {
            type: 'postback',
            label: '確定',
            data: 'confirm:yes',
          },
          {
            type: 'postback',
            label: '看一下目前資料',
            data: 'showData',
          },
          {
            type: 'message',
            label: '無',
            text: ' ',
          },
        ],
      },
    ],
    imageAspectRatio: 'square',
    imageSize: 'contain',
  },
}

export const getUrlConfig = (form): Message => {
  return {
    type: 'flex',
    altText: 'this is a flex message',
    contents: {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: [
          {
            type: 'text',
            // @ts-expect-error good
            text: '登記資料',
            weight: 'bold',
            size: 'xl',
            contents: [],
          },
          {
            type: 'separator',
            margin: 'sm',
          },
          {
            type: 'box',
            layout: 'vertical',
            margin: 'md',
            spacing: 'sm',
            contents: [
              {
                type: 'box',
                layout: 'baseline',
                spacing: 'sm',
                contents: [
                  {
                    type: 'text',
                    text: '登記人：',
                    color: '#aaaaaa',
                    size: 'sm',
                    flex: 2,
                  },
                  {
                    type: 'text',
                    text: form.signPerson,
                    wrap: true,
                    color: '#666666',
                    size: 'sm',
                    flex: 5,
                  },
                ],
              },
              {
                type: 'box',
                layout: 'baseline',
                spacing: 'sm',
                contents: [
                  {
                    type: 'text',
                    text: '使用目的：',
                    color: '#aaaaaa',
                    size: 'sm',
                    flex: 2,
                  },
                  {
                    type: 'text',
                    text: form.purpose,
                    wrap: true,
                    color: '#666666',
                    size: 'sm',
                    flex: 5,
                  },
                ],
              },
              {
                type: 'box',
                layout: 'baseline',
                spacing: 'sm',
                contents: [
                  {
                    type: 'text',
                    text: '開始時間：',
                    color: '#aaaaaa',
                    size: 'sm',
                    flex: 2,
                  },
                  {
                    type: 'text',
                    text: form.startTime,
                    wrap: true,
                    color: '#666666',
                    size: 'sm',
                    flex: 5,
                  },
                ],
              },
              {
                type: 'box',
                layout: 'baseline',
                spacing: 'sm',
                contents: [
                  {
                    type: 'text',
                    text: '結束時間：',
                    color: '#aaaaaa',
                    size: 'sm',
                    flex: 2,
                  },
                  {
                    type: 'text',
                    text: form.endTime,
                    wrap: true,
                    color: '#666666',
                    size: 'sm',
                    flex: 5,
                  },
                ],
              },
              {
                type: 'box',
                layout: 'baseline',
                spacing: 'sm',
                contents: [
                  {
                    type: 'text',
                    text: '總時長：',
                    color: '#aaaaaa',
                    size: 'sm',
                    flex: 2,
                  },
                  {
                    type: 'text',
                    text: form.totalTime,
                    wrap: true,
                    color: '#666666',
                    size: '13px',
                    flex: 5,
                  },
                ],
              },
            ],
          },
        ],
      },
    },
  }
}
