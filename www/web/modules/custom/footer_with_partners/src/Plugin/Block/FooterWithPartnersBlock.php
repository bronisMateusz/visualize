<?php

namespace Drupal\footer_with_partners\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Entity\Element\EntityAutocomplete;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides an footer with partners block.
 *
 * @Block(
 *   id = "footer_with_partners",
 *   admin_label = @Translation("Footer with partners"),
 *   category = "Visualize"
 * )
 */
class FooterWithPartnersBlock extends BlockBase implements ContainerFactoryPluginInterface {
  /**
   * The node storage.
   *
   * @var \Drupal\node\NodeStorage
   */
  protected $nodeStorage;

  /**
   * @param array $configuration
   * @param string $plugin_id
   * @param mixed $plugin_definition
   * @param \Drupal\Core\Session\AccountInterface $account
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, EntityTypeManagerInterface $entity_type_manager) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->nodeStorage = $entity_type_manager->getStorage('node');
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('entity_type.manager'),
    );
  }

  /**
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state) {
    $form = parent::blockForm($form, $form_state);
    $config = $this->getConfiguration();

    $form['title'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Partners section title'),
      '#default_value' => $config['title'] ?? $this->t("They trusted us"),
      '#size' => 60,
      '#maxlength' => 128,
    ];

    $form['partners_image']['partner_first'] = [
      '#type' => 'media_library',
      '#allowed_bundles' => ['image'],
      '#title' => $this->t('Upload partner logo'),
      '#description' => $this->t('Upload or select partner logo.'),
      '#default_value' => $config['partners_image']['partner_first'] ?? NULL,
    ];

    $form['partners_image']['partner_second'] = [
      '#type' => 'media_library',
      '#allowed_bundles' => ['image'],
      '#title' => $this->t('Upload partner logo'),
      '#description' => $this->t('Upload or select partner logo.'),
      '#default_value' => $config['partners_image']['partner_second'] ?? NULL,
    ];

    $form['partners_image']['partner_third'] = [
      '#type' => 'media_library',
      '#allowed_bundles' => ['image'],
      '#title' => $this->t('Upload partner logo'),
      '#description' => $this->t('Upload or select partner logo.'),
      '#default_value' => $config['partners_image']['partner_third'] ?? NULL,
    ];

    $form['partners_image']['partner_fourth'] = [
      '#type' => 'media_library',
      '#allowed_bundles' => ['image'],
      '#title' => $this->t('Upload partner logo'),
      '#description' => $this->t('Upload or select partner logo.'),
      '#default_value' => $config['partners_image']['partner_fourth'] ?? NULL,
    ];

    $form['partners_image']['partner_fifth'] = [
      '#type' => 'media_library',
      '#allowed_bundles' => ['image'],
      '#title' => $this->t('Upload partner logo'),
      '#description' => $this->t('Upload or select partner logo.'),
      '#default_value' => $config['partners_image']['partner_fifth'] ?? NULL,
    ];

    $privacy_policy_input = $config['privacy_policy_page'];

    if ($privacy_policy_input) {
      $privacy_policy_title = $this->nodeStorage->load($privacy_policy_input)->getTitle();
      $privacy_policy_title = $privacy_policy_title . ' (' . $privacy_policy_input . ')';
    }

    $form['privacy_policy_page'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Privacy policy page'),
      '#autocomplete_route_name' => 'footer_with_partners.autocomplete.node',
      '#autocomplete_route_parameters' => [
        'content_type_id' => 'basicpage',
      ],
      '#default_value' => $privacy_policy_title ?? NULL,
    ];
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state) {
    parent::blockSubmit($form, $form_state);
    $values = $form_state->getValues();
    $this->configuration['title'] = $values['title'];
    $this->configuration['partners_image']['partner_first'] = $values['partners_image']['partner_first'];
    $this->configuration['partners_image']['partner_second'] = $values['partners_image']['partner_second'];
    $this->configuration['partners_image']['partner_third'] = $values['partners_image']['partner_third'];
    $this->configuration['partners_image']['partner_fourth'] = $values['partners_image']['partner_fourth'];
    $this->configuration['partners_image']['partner_fifth'] = $values['partners_image']['partner_fifth'];
    $this->configuration['privacy_policy_page'] = EntityAutocomplete::extractEntityIdFromAutocompleteInput($values['privacy_policy_page']);
  }

  /**
   * {@inheritdoc}
   */
  public function build() {
    return [
      '#theme' => 'footer_with_partners',
      '#title' => $this->configuration['title'],
      '#partners_image' => $this->configuration['partners_image'],
      '#privacy_policy_address' => $this->nodeStorage->load($this->configuration['privacy_policy_page'])->toUrl()->toString(),
    ];
  }
}
