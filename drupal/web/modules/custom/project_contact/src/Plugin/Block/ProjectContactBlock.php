<?php

namespace Drupal\project_contact\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Provides an example block.
 *
 * @Block(
 *   id = "project_contact",
 *   admin_label = @Translation("Project contact"),
 *   category = "Visualize"
 * )
 */
class ProjectContactBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state) {
    $form = parent::blockForm($form, $form_state);
    $config = $this->getConfiguration();

    $form['welcome_message'] = [
      '#type' => 'text_format',
      '#title' => $this->t('Welcome message'),
      '#format' => 'restricted_html',
      '#allowed_formats' => ['restricted_html'],
      '#default_value' => $config['welcome_message']['value'] ?? $this->t("Do you have an idea? We'd love to make it a reality!"),
      '#size' => 60,
      '#maxlength' => 60,
    ];

    $form['background_media'] = [
      '#type' => 'media_library',
      '#allowed_bundles' => ['image', 'video', 'remote_video'],
      '#title' => $this->t('Background media'),
      '#description' => $this->t('Upload or select partner logo.'),
      '#default_value' => $config['background_media'] ?? NULL,
    ];
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state) {
    parent::blockSubmit($form, $form_state);
    $values = $form_state->getValues();
    $this->configuration['welcome_message'] = $values['welcome_message'];
    $this->configuration['background_media'] = $values['background_media'];
  }

  /**
   * {@inheritdoc}
   */
  public function build() {
    return [
      '#theme' => 'project_contact_block',
      '#welcome_message' => $this->configuration['welcome_message']['value'],
      '#background_media' => $this->configuration['background_media'],
      '#attached' => [
        'library' => [
          'project_contact/project-contact',
        ],
      ],
    ];
  }

}
