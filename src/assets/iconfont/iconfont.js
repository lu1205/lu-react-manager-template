;(window._iconfont_svg_string_4201030 =
    '<svg><symbol id="icon-shouye" viewBox="0 0 1024 1024"><path d="M979.2 473.6l-19.2 0L531.2 57.6c-12.8-12.8-25.6-12.8-38.4 0L57.6 473.6 44.8 473.6C19.2 473.6 0 492.8 0 518.4l0 38.4c0 25.6 19.2 44.8 44.8 44.8l115.2 0L160 896c0 25.6 19.2 44.8 44.8 44.8l185.6 0c25.6 0 44.8-19.2 44.8-44.8l0-236.8 153.6 0L588.8 896c0 25.6 19.2 44.8 44.8 44.8l185.6 0c25.6 0 44.8-19.2 44.8-44.8L864 601.6l115.2 0c25.6 0 44.8-19.2 44.8-44.8L1024 518.4C1024 492.8 1004.8 473.6 979.2 473.6z" fill="#8C8C8C" ></path></symbol></svg>'),
    (function (n) {
        var t = (t = document.getElementsByTagName('script'))[t.length - 1],
            e = t.getAttribute('data-injectcss'),
            t = t.getAttribute('data-disable-injectsvg')
        if (!t) {
            var o,
                i,
                c,
                d,
                l,
                s = function (t, e) {
                    e.parentNode.insertBefore(t, e)
                }
            if (e && !n.__iconfont__svg__cssinject__) {
                n.__iconfont__svg__cssinject__ = !0
                try {
                    document.write(
                        '<style>.svgfont {display: inline-block;width: 1em;height: 1em;fill: currentColor;vertical-align: -0.1em;font-size:16px;}</style>'
                    )
                } catch (t) {
                    console && console.log(t)
                }
            }
            ;(o = function () {
                let t,
                    e = document.createElement('div')
                ;(e.innerHTML = n._iconfont_svg_string_4201030),
                    (e = e.getElementsByTagName('svg')[0]) &&
                        (e.setAttribute('aria-hidden', 'true'),
                        (e.style.position = 'absolute'),
                        (e.style.width = 0),
                        (e.style.height = 0),
                        (e.style.overflow = 'hidden'),
                        (e = e),
                        (t = document.body).firstChild ? s(e, t.firstChild) : t.appendChild(e))
            }),
                document.addEventListener
                    ? ~['complete', 'loaded', 'interactive'].indexOf(document.readyState)
                        ? setTimeout(o, 0)
                        : ((i = function () {
                              document.removeEventListener('DOMContentLoaded', i, !1), o()
                          }),
                          document.addEventListener('DOMContentLoaded', i, !1))
                    : document.attachEvent &&
                      ((c = o),
                      (d = n.document),
                      (l = !1),
                      r(),
                      (d.onreadystatechange = function () {
                          'complete' == d.readyState && ((d.onreadystatechange = null), a())
                      }))
        }
        function a() {
            l || ((l = !0), c())
        }
        function r() {
            try {
                d.documentElement.doScroll('left')
            } catch (t) {
                return void setTimeout(r, 50)
            }
            a()
        }
    })(window)
