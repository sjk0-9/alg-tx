import React, { useState } from 'react';
import Dialog from '../components/Dialog';
import { Checkbox, Label } from '../components/form';
import { InlineWrapper } from '../components/form/wrappers';

export const DISCLAIMER_VERSION = 'Pyromaniac Lemon';

type DisclaimerProps = {
  isOpen: boolean;
  onCancel: () => void;
  onAccept: (doNotShowAgain: boolean) => void;
};

const Disclaimer = ({ onCancel, onAccept, isOpen }: DisclaimerProps) => {
  const [agree, setAgree] = useState<boolean>(false);
  const [doNotShow, setDoNotShow] = useState<boolean>(false);
  return (
    <Dialog
      open={isOpen}
      onClose={onCancel}
      title="Disclaimer"
      description="Agree to terms and conditions"
    >
      <p className="my-2">
        This product is in early Alpha. It is by no means stable. It may change
        at any time. Features may be added or removed. Braking changes may
        occur.
      </p>
      <p className="my-2">
        By using the product you agree that you understand the nature and risks
        of transacting on the algorand ecosystem. You agree that you are taking
        all necessary precautions to protect yourself and your assets. You agree
        that you will thoughrougly review all transactions you sign and publish
        through this platform.
      </p>
      <p className="my-2">
        THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY
        KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
        MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
        IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
        CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
        TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
        SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
      </p>
      <div className="my-2">
        <InlineWrapper>
          <Label>
            <Checkbox
              checked={agree}
              onChange={e => setAgree(e.currentTarget.checked)}
            />
            <span>I agree.</span>
          </Label>
        </InlineWrapper>
        <InlineWrapper>
          <Label>
            <Checkbox
              checked={doNotShow}
              onChange={e => setDoNotShow(e.currentTarget.checked)}
            />
            <span>Don&apos;t ask again.</span>
          </Label>
        </InlineWrapper>
      </div>
    </Dialog>
  );
};

export default Disclaimer;
