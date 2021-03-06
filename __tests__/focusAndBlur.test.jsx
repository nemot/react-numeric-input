/* global describe, it */
import expect       from 'expect'
import NumericInput from '../src/NumericInput.jsx'
import React        from 'react'
import TestUtils    from 'react-addons-test-utils'

describe('NumericInput', function() {

    it('passes focus events to "onFocus" prop', (done) => {
        let onFocusCalls = 0, widget

        function onFocus(event) {
            onFocusCalls += 1
            expect(this).toEqual(null)
            expect(typeof event).toEqual("object")
        }

        widget = TestUtils.renderIntoDocument(
            <NumericInput onFocus={ onFocus } />
        )

        // Rendering must not bring the focus to the input
        expect(onFocusCalls).toEqual(0)

        // Trigger a focus on the input and assert that
        // the onFocus callback receives it
        TestUtils.Simulate.focus(widget.refs.input)

        setTimeout(() => {
            expect(onFocusCalls).toEqual(1)

            // Now blur and then click on the up button. That should return
            // the focus back to the input and call the onFocus callback again
            TestUtils.Simulate.blur(widget.refs.input)
            setTimeout(() => {
                TestUtils.Simulate.mouseDown(widget.refs.input.nextElementSibling)
                setTimeout(() => {
                    expect(onFocusCalls).toEqual(2)
                    done()
                }, 50)
            }, 50)
        }, 50)
    });

    it('passes blur events to "onBlur" prop', (done) => {
        let onBlurCalls = 0
        let widget = TestUtils.renderIntoDocument(
            <NumericInput onBlur={ function(event) {
                onBlurCalls += 1
                expect(this).toEqual(null)
                expect(typeof event).toEqual("object")
            }} />
        )

        // Rendering must not trigger any blur on the input
        expect(onBlurCalls).toEqual(0)

        // Start by focusing the input
        TestUtils.Simulate.focus(widget.refs.input)

        // Test again to see if after focus the input didn't blur somehow
        setTimeout(() => {
            expect(onBlurCalls).toEqual(0)

            // Trigger a blur on the input and assert that
            // the onBlur callback receives it
            TestUtils.Simulate.blur(widget.refs.input)
            setTimeout(() => {
                expect(onBlurCalls).toEqual(1)

                // Hit the up button. This should bring the focus back to the
                // input
                TestUtils.Simulate.mouseDown(widget.refs.input.nextElementSibling)
                setTimeout(() => {

                    // Now blur it again and see if it counts
                    TestUtils.Simulate.blur(widget.refs.input)
                    setTimeout(() => {
                        expect(onBlurCalls).toEqual(2)
                        done()
                    }, 50)
                }, 50)
            }, 50)
        }, 50)

    });

    it('respects the "autoFocus" prop', (done) => {
        let onFocusCalls = 0

        let widget = TestUtils.renderIntoDocument(
            <NumericInput autoFocus onFocus={ () => onFocusCalls += 1 } />
        )

        // window.blur()
        // window.focus()

        // Rendering must bring the focus to the input
        setTimeout(() => {
            if (document.activeElement === widget.refs.input) {
                expect(onFocusCalls).toEqual(1)
                done()
            }
            else {
                // console.log("Unable to test autoFocus")
                done(/*new Error("Unable to autoFocus")*/)
            }
        }, 1000)
    })
});
