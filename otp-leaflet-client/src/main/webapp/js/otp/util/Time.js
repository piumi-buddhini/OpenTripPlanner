/* This program is free software: you can redistribute it and/or
   modify it under the terms of the GNU Lesser General Public License
   as published by the Free Software Foundation, either version 3 of
   the License, or (at your option) any later version.
   
   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.
   
   You should have received a copy of the GNU General Public License
   along with this program.  If not, see <http://www.gnu.org/licenses/>. 
*/

otp.namespace("otp.util");

/**
 * Utility routines for date/time conversion
 */
 
otp.util.Time = {

    msToHrMin : function(ms) {
        var hrs = Math.floor(ms / 3600000);
        var mins = Math.floor(ms / 60000) % 60;
        
        // TODO: localization
        var str = (hrs > 0 ? (hrs +" hr, ") : "") + mins + " min";
    
        return str;
    },
    
    msToHrMinSec : function(ms) {
        var hrs = Math.floor(ms / 3600000);
        var mins = Math.floor(ms / 60000) % 60;
        var secs = Math.floor(ms / 1000) % 60;
        
        // TODO: localization
        var str = (hrs > 0 ? (hrs +" hr, ") : "") + (mins > 0 ? (mins +" min, ") : "") + secs + " sec";
    
        return str;
    },
        
    formatItinTime : function(timestamp, formatStr) {
        formatStr = formatStr || otp.config.timeFormat+", "+otp.config.dateFormat;
        return moment(timestamp).add("hours", otp.config.timeOffset).format(formatStr);
    },

    correctAmPmTimeString : function(time, format) {
        // step 0: leave if we don't have what we need...
        if(otp.config.timeFormat && otp.config.timeFormat.slice(-1) !== 'a') return time;
        if(time == null || time.length < 1) return time;


        // step 1: clean up input param
        time = time.toLowerCase().trim();

        // step 2: break up the time into H MM a/p parts
        var ttime = time.match(/(\d+)(?::(\d\d))?\s*([ap]?)/);
        var h = ttime[1];
        var m = parseInt(ttime[2], 10) || null;
        var am = ttime[3];

        // step 3: fix up the hours string (make sure it's 1 or 2 chracters long ... if longer, fix) 
        if(h && h.length > 2)
        {
            if(m == null)
                m = h.substring(h.length-2);
            h = h.substring(0, h.length-2);
        }
        h = parseInt(h, 10) || 12;

        // step 4: fix AM / PM on hours that are longer than 12 (and don't otherwise specify am/pm)
        if(h > 12)
        {
            h = h % 12;
            if(h == 0)
                h = 12;
            if(am == null || am == '')
                am = 'p';
        }

        // step 5: fix up the minutes, making sure they're 
        if (m == null || m > 59 || m < 0)
        {
            m = "00";
        }
        else if(m.length != 2 && m >= 0 && m <= 9)
        {
            m = "0" + m;       // pad single digit number
        }

        // step 5b: cast m back into a string
        m = "" + m + "";
        if(m.length != 2)
            console.log("ERROR: we have problem with our minutes string:== " + m);

        // step 6: rationalize the a/p stuff...
        if(am)
        {
            if(am == 'p')
                am = "pm"
            else
                am = "am"
        } 
        else
        {
            // step 6b: when no a/p given, choose best fit for transit (e.g., 12pm and 8am are more popular times than 12am and 8pm)
            if(h > 6 && h < 12)
                am = "am";
            else
                am = "pm";
        }

        // step 7: if our format has a space between MM and AM/PM, add that spacer to our output
        var space = "";
        if(format && format.toLowerCase().charAt(format.length-2) == " ")
            space = " ";

        // step 8: final h:m <space> am/pm formatting and return...
        return  h + ":" + m + space + am;
    },

    CLASS_NAME: "otp.util.Time"
};
