export default {
  data() {
    return {
      timeline: {
      },
    };
  },
  methods: {
    timeline_render() {
      return (
        <div class="timeline">
          <div class="timeline-item">
            <div class="timeline-item-date"></div>
            <div class="timeline-item-divider"></div>
            <div class="timeline-item-content">
              <div class="timeline-item-time">12:33</div>
              <div class="timeline-item-title">Item Title</div>
              <div class="timeline-item-subtitle">Item Subtitle</div>
              <div class="timeline-item-text">Item Text</div>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-item-date"><small>2020/38/46</small></div>
            <div class="timeline-item-divider"></div>
            <div class="timeline-item-content">
              <div class="timeline-item-time">12:33 root</div>
              <div class="timeline-item-title">Item Title</div>
              <f7-list>
                <f7-list-item>a</f7-list-item>
                <f7-list-item>a</f7-list-item>
              </f7-list>
            </div>
          </div>
        </div>
      );
    },
  },
};
