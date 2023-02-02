<?php

namespace Drupal\footer_with_partners\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Entity\Element\EntityAutocomplete;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

/**
 * Defines a route controller for watches autocomplete form elements.
 */
class BasicpageAutocompleteController extends ControllerBase {

  /**
   * Node autocomplete handler.
   *
   * @param \Symfony\Component\HttpFoundation\Request $request
   *   Request.
   * @param $content_type_id
   *   Node type id.
   *
   * @return \Symfony\Component\HttpFoundation\JsonResponse
   *   Json response.
   *
   * @throws \Drupal\Component\Plugin\Exception\InvalidPluginDefinitionException
   * @throws \Drupal\Component\Plugin\Exception\PluginNotFoundException
   */
  public function handleNode(Request $request, $content_type_id): JsonResponse {
    $nodes = $this->entityTypeManager()
      ->getStorage('node')
      ->loadByProperties([
        'type' => $content_type_id,
        'status' => 1,
      ]);
    $input = $request->query->get('q');
    $response = [];

    /** @var \Drupal\node\NodeInterface $node */
    foreach ($nodes as $node) {
      if ((stripos($node->getTitle(), $input) !== FALSE)) {
        $response[] = [
          'value' => EntityAutocomplete::getEntityLabels([$node]),
          'label' => $node->getTitle(),
        ];
      }
    }

    return new JsonResponse($response);
  }

}
