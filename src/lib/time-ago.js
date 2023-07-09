import {format} from 'timeago.js';
import {directive, AsyncDirective} from 'lit/async-directive.js';

class TimeAgoDirective extends AsyncDirective {
    timer;
    time;

    render(time) {
        return format(time);
    }

    update(part, [time]) {
        this.time = time;
        if (this.isConnected) {
            this.ensureTimerStarted();
        }
        return this.render(time);
    }

    ensureTimerStarted() {
        if (this.timer === undefined) {
            this.timer = setInterval(() => {
                this.setValue(this.render(this.time));
            }, 1000);
        }
    }

    ensureTimerStopped() {
        clearInterval(this.timer);
        this.timer = undefined;
    }

    disconnected() {
        this.ensureTimerStopped();
    }
}

export const timeAgo = directive(TimeAgoDirective);
