<?php

namespace Drupal\cookie_notice\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Provides an example block.
 *
 * @Block(
 *   id = "cookie_notice",
 *   admin_label = @Translation("Cookie notice"),
 *   category = @Translation("Visualize")
 * )
 */
class CookieNoticeBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state) {
    $form = parent::blockForm($form, $form_state);
    $config = $this->getConfiguration();

    $form['cookie_notice'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Cookie notice'),
      '#default_value' => $config['cookie_notice'] ?? $this->t("We use cookies to improve your experience on the site."),
      '#size' => 60,
      '#maxlength' => 128,
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state) {
    parent::blockSubmit($form, $form_state);
    $values = $form_state->getValues();
    $this->configuration['cookie_notice'] = $values['cookie_notice'];
  }

  /**
   * {@inheritdoc}
   */
  public function build() {
    return [
      '#theme' => 'cookie_notice',
      '#cookie_notice' => $this->configuration['cookie_notice'],
    ];
  }
}
