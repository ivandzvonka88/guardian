import React from 'react';
import {StyleSheet, ScrollView, Platform, Modal} from 'react-native';
import {Block, Text as GalioText, Button, theme} from 'galio-framework';

import materialTheme from 'src/constants/Theme';
import {StatusHeight} from 'src/constants/utils';

function Text({children, style, ...rest}) {
  return (
    <GalioText style={[styles.rawText, {...style}]} color="white" {...rest}>
      {children}
    </GalioText>
  );
}

export default function Terms({isVisible, onClose}) {
  return (
    <Modal visible={isVisible}>
      <Block flex style={styles.container}>
        {/* <StatusBar barStyle="light-content" /> */}
        <Block center style={styles.title}>
          <Text size={20}>Terms Of Use</Text>
        </Block>
        <ScrollView style={styles.marginTop1}>
          <Block>
            <Text size={16}>
              THERAPY CORNER LLC, an Arizona limited liability company (
              <Text bold>"THERAPY CORNER"</Text> or <Text bold>"We"</Text>),
              respects your privacy and is committed to protecting it through
              our compliance with this policy. This policy describes:
            </Text>
          </Block>
          <Block style={[styles.marginTop1, styles.paddingLeft1]}>
            <Text size={16}>
              <Text bold>• </Text> The types of information we may collect or
              that you may provide when you download, install, register with,
              access, or use THERAPY CORNER’S Informed mobile application (the "
              <Text bold>App</Text>").
            </Text>
            <Text size={16}>
              <Text bold>• </Text> Our practices for collecting, using,
              maintaining, protecting, and disclosing that information.
            </Text>
          </Block>

          <Block style={styles.marginTop1}>
            <Text size={16}>
              This policy applies only to information we collect in this App and
              in email, text, and other electronic communications sent through
              or in connection with this App.
            </Text>
          </Block>

          <Block style={styles.marginTop1}>
            <Text size={16}>
              Please read this policy carefully to understand our policies and
              practices regarding your information and how we will treat it. If
              you do not agree with our policies and practices, do not download,
              register with, or use this App. By downloading, registering with,
              or using this App, you agree to this privacy policy. This policy
              may change from time to time (see LINK TO "CHANGES TO OUR PRIVACY
              POLICY”). Your continued use of this App after we make changes is
              deemed to be acceptance of those changes, so please check the
              policy periodically for updates.
            </Text>
          </Block>

          <Block style={styles.marginTop1}>
            <Text bold size={16}>
              Information We Collect and How We Collect It
            </Text>
          </Block>

          <Block style={styles.marginTop1}>
            <Text size={16}>
              We collect information from and about users of our App:
            </Text>
          </Block>

          <Block style={[styles.marginTop1, styles.paddingLeft1]}>
            <Text size={16}>
              <Text size={16}>
                <Text bold>• </Text> Directly from you when you provide it to
                us.
              </Text>
            </Text>
            <Text size={16}>
              <Text size={16}>
                <Text bold>• </Text> Automatically when you use the App.
              </Text>
            </Text>
          </Block>

          <Block style={styles.marginTop3}>
            <Text bold size={16} style={{textDecorationLine: 'underline'}}>
              Information You Provide to Us
            </Text>
          </Block>

          <Block style={styles.marginTop1}>
            <Text size={16}>
              When you download, register with, or use this App, we may ask you
              provide information:
            </Text>
          </Block>

          <Block style={[styles.marginTop1, styles.paddingLeft1]}>
            <Text size={16}>
              <Text size={16}>
                <Text bold>• </Text> By which you may be personally identified,
                such as name, postal address, email address, telephone number,
                social security number, as well as information related to your
                medical history, including information that is considered
                “protected health information” under certain state laws and
                federal laws such as HIPAA and HITECH (collectively, "PHI").
              </Text>
            </Text>
            <Text size={16}>
              <Text size={16}>
                <Text bold>• </Text> That is about you but individually does not
                identify you such as certain demographic information.
              </Text>
            </Text>
          </Block>

          <Block style={styles.marginTop1}>
            <Text size={16}>This information includes:</Text>
          </Block>

          <Block style={[styles.marginTop1, styles.paddingLeft1]}>
            <Text size={16}>
              <Text size={16}>
                <Text bold>• </Text> Information that you provide by filling in
                forms in the Web App. This includes information provided at the
                time of registering to use the App, and requesting further
                services. We may also ask you for information when you report a
                problem with the App.
              </Text>
            </Text>
            <Text size={16}>
              <Text size={16}>
                <Text bold>• </Text> Information collected from you during your
                use of the App.
              </Text>
            </Text>
            <Text size={16}>
              <Text size={16}>
                <Text bold>• </Text> Information submitted by your approved
                health care providers.
              </Text>
            </Text>
            <Text size={16}>
              <Text size={16}>
                <Text bold>• </Text> Information you provide related to persons
                you consent to share your PHI with, such as family members,
                care-takers, or medical professionals, as well as any
                communications between you and such persons.
              </Text>
            </Text>
            <Text size={16}>
              <Text size={16}>
                <Text bold>• </Text> Records and copies of your correspondence
                (including email addresses and phone numbers), if you contact
                us.
              </Text>
            </Text>
            <Text size={16}>
              <Text size={16}>
                <Text bold>• </Text> Your responses to surveys that we might ask
                you to complete for research purposes.
              </Text>
            </Text>
            <Text size={16}>
              <Text size={16}>
                <Text bold>• </Text> Details of transactions you carry out
                through the App and of the fulfillment of your requests.
              </Text>
            </Text>
          </Block>

          <Block style={styles.marginTop3}>
            <Text bold size={16} style={{textDecorationLine: 'underline'}}>
              Automatic Information Collection and Tracking
            </Text>
          </Block>

          <Block style={styles.marginTop1}>
            <Text size={16}>
              When you download, access, and use the App, it may use technology
              to automatically collect:
            </Text>
          </Block>

          <Block style={[styles.marginTop1, styles.paddingLeft1]}>
            <Text size={16}>
              <Text size={16}>
                <Text bold>• Usage Details.</Text> By which you may be
                personally identified, such as name, postal address, email
                address, telephone number, social security number, as well as
                information related to your medical history, including
                information that is considered “protected health information”
                under certain state laws and federal laws such as HIPAA and
                HITECH (collectively, "PHI").
              </Text>
            </Text>
            <Text size={16}>
              <Text size={16}>
                <Text bold>• Location Information.</Text> This App collects user
                clock in and clock out location to satisfy the electronic visit
                verification mandate in the state of Arizona, this is the limit
                of the location data that the application collects when in use.
              </Text>
            </Text>
          </Block>

          <Block style={styles.marginTop1}>
            <Text size={16}>
              If you do not want us to collect this information, do not download
              the App or delete it from your device. For more information, see
              LINK TO CHOICES ABOUT HOW WE USE AND DISCLOSE YOUR INFORMATION.
            </Text>
          </Block>

          <Block style={styles.marginTop3}>
            <Text bold size={16} style={{textDecorationLine: 'underline'}}>
              Information Collection and Tracking Technologies 
            </Text>
          </Block>

          <Block style={styles.marginTop1}>
            <Text bold size={16}>
              How We Use Your Information
            </Text>
          </Block>

          <Block style={styles.marginTop1}>
            <Text size={16}>
              We use information that we collect about you or that you provide
              to us, including any PHI, to:
            </Text>
          </Block>

          <Block style={[styles.marginTop1, styles.paddingLeft1]}>
            <Text size={16}>
              <Text size={16}>
                <Text bold>• </Text> Provide you with the App and its contents,
                and any other information, products or services that you request
                from us.
              </Text>
            </Text>
            <Text size={16}>
              <Text size={16}>
                <Text bold>• </Text> Fulfill any other purpose for which you
                provide it.
              </Text>
            </Text>
            <Text size={16}>
              <Text size={16}>
                <Text bold>• </Text> Give you notices about your account,
                including expiration and renewal notices.
              </Text>
            </Text>
            <Text size={16}>
              <Text size={16}>
                <Text bold>• </Text> Carry out our obligations and enforce our
                rights arising from any contracts or agreements entered into
                between you and us.
              </Text>
            </Text>
            <Text size={16}>
              <Text size={16}>
                <Text bold>• </Text> Notify you when App updates are available,
                and of changes to any products or services we offer or provide
                though it.
              </Text>
            </Text>
          </Block>

          <Block style={styles.marginTop1}>
            <Text size={16}>
              The usage information we collect helps us to improve our App and
              to deliver a better and more personalized experience by enabling
              us to:
            </Text>
          </Block>

          <Block style={[styles.marginTop1, styles.paddingLeft1]}>
            <Text size={16}>
              <Text size={16}>
                <Text bold>• </Text> Estimate our audience size and usage
                patterns.
              </Text>
            </Text>
            <Text size={16}>
              <Text size={16}>
                <Text bold>• </Text> Store information about your preferences,
                allowing us to customize our App according to your individual
                preferences.
              </Text>
            </Text>
            <Text size={16}>
              <Text size={16}>
                <Text bold>• </Text> Speed up your searches.
              </Text>
            </Text>
            <Text size={16}>
              <Text size={16}>
                <Text bold>• </Text> Recognize you when you use the App.
              </Text>
            </Text>
          </Block>

          <Block style={styles.marginTop1}>
            <Text size={16}>
              We may also use your information to contact you about our own and
              third parties' goods and services that may be of interest to you.
              If you do not want us to use your information in this way, please
              check the relevant box located on the form on which we collect
              your data. For more information, see LINK TO "CHOICES ABOUT HOW WE
              USE AND DISCLOSE YOUR INFORMATION".
            </Text>
          </Block>

          <Block style={styles.marginTop3}>
            <Text bold size={16}>
              Aggregated and De-identified Data
            </Text>
          </Block>

          <Block style={styles.marginTop1}>
            <Text size={16}>
              Subject to applicable state and federal law, including but not
              limited to our obligations under HIPAA and HITECH, we may license,
              sell, or otherwise share aggregated, de-identified versions of
              your PHI and other data (“De-identified Information”) with our
              subsidiaries, affiliates, partners, customers, investors, and
              contractors for any purpose. You agree and acknowledge that
              Therapy Corner is the sole and exclusive owner of any
              De-identified Information created by Therapy Corner and that you
              have no ownership or other intellectual property rights in or to
              such De-identified Information.
            </Text>
          </Block>

          <Block style={styles.marginTop3}>
            <Text bold size={16}>
              Disclosure of Your Information
            </Text>
          </Block>

          <Block style={styles.marginTop1}>
            <Text size={16}>
              We may disclose PHI or other personal information that we collect
              or you provide:
            </Text>
          </Block>

          <Block style={[styles.marginTop1, styles.paddingLeft1]}>
            <Text size={16}>
              <Text size={16}>
                <Text bold>• </Text> To our subsidiaries and affiliates who are
                bound by contractual obligations to keep PHI and other personal
                information confidential and use it only for the purposes for
                which we disclose it to them.
              </Text>
            </Text>
            <Text size={16}>
              <Text size={16}>
                <Text bold>• </Text> To contractors, service providers, and
                other third parties we use to support our business and who are
                bound by contractual obligations to keep PHI and other personal
                information confidential and use it only for the purposes for
                which we disclose it to them.
              </Text>
            </Text>
            <Text size={16}>
              <Text size={16}>
                <Text bold>• </Text> To fulfill the purpose for which you
                provide it.
              </Text>
            </Text>
            <Text size={16}>
              <Text size={16}>
                <Text bold>• </Text> For any other purpose disclosed by us when
                you provide the information.
              </Text>
            </Text>
            <Text size={16}>
              <Text size={16}>
                <Text bold>• </Text> With your consent.
              </Text>
            </Text>
            <Text size={16}>
              <Text size={16}>
                <Text bold>• </Text> To comply with any court order, law, or
                legal process, including to respond to any government or
                regulatory request.
              </Text>
            </Text>
            <Text size={16}>
              <Text size={16}>
                <Text bold>• </Text> To enforce our rights arising from any
                contracts entered into between you and us, including the End
                User License Agreement, and for billing and collection.
              </Text>
            </Text>
            <Text size={16}>
              <Text size={16}>
                <Text bold>• </Text> Subject to applicable laws, if we believe
                disclosure is necessary or appropriate to protect the rights,
                property, or safety of Therapy Corner LLC, our customers or
                others. This includes exchanging information with other
                companies and organizations for the purposes of fraud
                protection.
              </Text>
            </Text>
          </Block>

          <Block style={styles.marginTop3}>
            <Text bold size={16}>
              Accessing and Correcting Your PHI and Other Personal Information
            </Text>
          </Block>

          <Block style={styles.marginTop1}>
            <Text size={16}>
              You can review and change your PHI or other information by logging
              into the App and visiting your account profile page. We cannot
              change your PHI or other information nor can we delete your PHI or
              other information except by also deleting your user account. We
              may deny access to your PHI or personal information when required
              by law or if we believe such access would cause the PHI or other
              information of a third party to be revealed.
            </Text>
          </Block>

          <Block style={styles.marginTop3}>
            <Text bold size={16}>
              Data Security
            </Text>
          </Block>

          <Block style={styles.marginTop1}>
            <Text size={16}>
              We have implemented technical, physical, administrative and
              organizational measures designed to secure your PHI and other
              personal information from accidental loss and from unauthorized
              access, use, alteration, and disclosure. All information you
              provide to us is stored on our secure servers behind firewalls
              which conform to applicable state and federal regulations.
            </Text>
          </Block>

          <Block style={styles.marginTop1}>
            <Text size={16}>
              The safety and security of your information also depends on you.
              Where we have given you (or where you have chosen) a password or
              security pin number for access to certain parts of our App, you
              are responsible for keeping this password confidential. Do not to
              share your password with anyone.
            </Text>
          </Block>

          <Block style={styles.marginTop1}>
            <Text size={16}>
              Unfortunately, the transmission of information via the internet
              and mobile platforms is not completely secure. Although we do our
              best to protect your PHI and other personal information, we cannot
              guarantee the security of your PHI and other personal information
              transmitted through our App. Any transmission of PHI and other
              personal information is at your own risk. We are not responsible
              for circumvention of any privacy settings or security measures we
              provide.
            </Text>
          </Block>

          <Block style={styles.marginTop3}>
            <Text bold size={16}>
              Changes to Our Privacy Policy
            </Text>
          </Block>

          <Block style={styles.marginTop1}>
            <Text size={16}>
              We may update our privacy policy from time to time. If we make
              material changes to how we treat our users' PHI, we will post the
              new privacy policy on this page with a notice that the privacy
              policy has been updated and notify you by an in-App alert the
              first time you use the App after we make the change.
            </Text>
          </Block>

          <Block style={styles.marginTop3}>
            <Text bold size={16}>
              Contact Information
            </Text>
          </Block>

          <Block style={styles.marginTop1}>
            <Text size={16}>
              To ask questions or comment about this privacy policy and our
              privacy practices, contact us at:{' '}
              <Text italic>support@therapycorner.com</Text>
            </Text>
          </Block>
        </ScrollView>

        <Block center style={styles.buttonBlock}>
          <Button color={materialTheme.COLORS.BUTTON_COLOR} onPress={onClose}>
            Accept
          </Button>
        </Block>
      </Block>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: materialTheme.COLORS.PRIMARY,
    paddingTop:
      Platform.OS === 'android'
        ? theme.SIZES.BASE * 1.5
        : theme.SIZES.BASE * 3.5 + (StatusHeight || 0),
    paddingHorizontal: theme.SIZES.BASE * 1.5,
    paddingBottom: theme.SIZES.BASE * 1.5,
  },
  rawText: {
    lineHeight: 24,
  },
  title: {
    paddingVertical: theme.SIZES.BASE * 1,
  },
  marginTop1: {
    marginTop: theme.SIZES.BASE * 1,
  },
  marginTop2: {
    marginTop: theme.SIZES.BASE * 2,
  },
  marginTop3: {
    marginTop: theme.SIZES.BASE * 3,
  },
  paddingLeft1: {
    paddingLeft: theme.SIZES.BASE * 1,
  },
  paddingLeft2: {
    paddingLeft: theme.SIZES.BASE * 2,
  },
  paddingRight1: {
    paddingRight: theme.SIZES.BASE * 1,
  },
  marginLeft1: {
    marginLeft: theme.SIZES.BASE * 1,
  },
  buttonBlock: {
    paddingVertical: theme.SIZES.BASE * 1,
  },
});
