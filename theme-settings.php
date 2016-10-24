<?php

/**
 * Implements hook_form_system_theme_settings_alter().
 *
 * Custom theme settings
 */
function infinite_form_system_theme_settings_alter(&$form, &$form_state) {

  /*--------------- Share button Settings --------------*/
  $form['share'] = array(
    '#type' => 'fieldset',
    '#title' => t('Share button settings'),
    '#collapsed' => TRUE,
    '#collapsible' => TRUE,
  );

  $form['share']['gtm_id'] = array(
    '#type' => 'textfield',
    '#title' => t('Google tag manager ID'),
    '#default_value' => theme_get_setting('gtm_id'),
    '#size' => 80,
    '#description' => t('Enter your Google tag manager ID.'),
    '#prefix' => '<div id="gtm-id-wrapper">',
    '#suffix' => '</div>',
  );

  $form['share']['share_image_style'] = array(
    '#type' => 'select',
    '#title' => t('Image style for sharing'),
    '#options' => image_style_options(),
    '#default_value' => theme_get_setting('share_image_style'),
    '#description' => t('Select the image style, that will be used for sharing on social media.'),
    '#prefix' => '<div id="share-image-style-wrapper">',
    '#suffix' => '</div>',
  );

  $form['share']['facebook_share_button'] = array(
    '#type' => 'textfield',
    '#title' => t('Facebook share button text'),
    '#default_value' => theme_get_setting('facebook_share_button'),
    '#size' => 80,
    '#description' => t('Enter the the text, that will be shown on the facebook share button.'),
    '#prefix' => '<div id="facebook-share-button-wrapper">',
    '#suffix' => '</div>',
  );

  $form['share']['whatsapp_share_button'] = array(
    '#type' => 'textfield',
    '#title' => t('Whatsapp share button text'),
    '#default_value' => theme_get_setting('whatsapp_share_button'),
    '#size' => 80,
    '#description' => t('Enter the the text, that will be shown on the whatsapp share button.'),
    '#prefix' => '<div id="whatsapp-share-button-wrapper">',
    '#suffix' => '</div>',
  );

  $form['share']['whatsapp_share_text'] = array(
    '#type' => 'textfield',
    '#title' => t('Whatsapp share text'),
    '#default_value' => theme_get_setting('whatsapp_share_text'),
    '#size' => 80,
    '#description' => t('Enter the the text, that will be shown as share whatsapp text.'),
    '#prefix' => '<div id="whatsapp-share-text-wrapper">',
    '#suffix' => '</div>',
  );

  $form['share']['pinterest_share_button'] = array(
    '#type' => 'textfield',
    '#title' => t('Pinterest share button text'),
    '#default_value' => theme_get_setting('pinterest_share_button'),
    '#size' => 80,
    '#description' => t('Enter the the text, that will be shown on the pinterest share button.'),
    '#prefix' => '<div id="pinterest-share-button-wrapper">',
    '#suffix' => '</div>',
  );

  $form['share']['twitter_share_button'] = array(
    '#type' => 'textfield',
    '#title' => t('Twitter share button text'),
    '#default_value' => theme_get_setting('twitter_share_button'),
    '#size' => 80,
    '#description' => t('Enter the the text, that will be shown on the twitter share button.'),
    '#prefix' => '<div id="twitter-share-button-wrapper">',
    '#suffix' => '</div>',
  );

  $form['share']['twitter_share_via'] = array(
    '#type' => 'textfield',
    '#title' => t('Via wich twitter handle to share.'),
    '#default_value' => theme_get_setting('twitter_share_via'),
    '#size' => 80,
    '#description' => t('Enter the the twitter handle, that will be shown when sharing content.'),
    '#prefix' => '<div id="twitter-share-via-wrapper">',
    '#suffix' => '</div>',
  );

  $form['share']['email_share_button'] = array(
    '#type' => 'textfield',
    '#title' => t('Email share button text'),
    '#default_value' => theme_get_setting('email_share_button'),
    '#size' => 80,
    '#description' => t('Enter the the text, that will be shown on the email share button.'),
    '#prefix' => '<div id="email-share-button-wrapper">',
    '#suffix' => '</div>',
  );

  $form['share']['email_share_text'] = array(
    '#type' => 'textfield',
    '#title' => t('Email share text'),
    '#default_value' => theme_get_setting('email_share_text'),
    '#size' => 80,
    '#description' => t('Enter the the text, that will be shown in the email.'),
    '#prefix' => '<div id="email-share-button-wrapper">',
    '#suffix' => '</div>',
  );

  $form['share']['email_subject'] = array(
    '#type' => 'textfield',
    '#title' => t('Email subject text'),
    '#default_value' => theme_get_setting('email_subject'),
    '#size' => 80,
    '#description' => t('Enter the the text, that will be shown as the email subject.'),
    '#prefix' => '<div id="email-share-subject-wrapper">',
    '#suffix' => '</div>',
  );
}
